// src/Pages/Gui.js
import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const Gui = () => {
    const [currentAlphabet, setCurrentAlphabet] = useState('N/A');
    const [currentWord, setCurrentWord] = useState('N/A');
    const [currentSentence, setCurrentSentence] = useState('N/A');
    const [isPaused, setIsPaused] = useState(false);
    const [hasCameraAccess, setHasCameraAccess] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [stabilizationBuffer, setStabilizationBuffer] = useState([]);
    const [wordBuffer, setWordBuffer] = useState('');
    const [lastRegisteredTime, setLastRegisteredTime] = useState(Date.now());
    const registrationDelay = 1500; // Minimum delay (in milliseconds) before registering the same character again

    const resetSentence = () => {
        setCurrentWord('N/A');
        setCurrentSentence('N/A');
        setCurrentAlphabet('N/A');
        setStabilizationBuffer([]);
        setWordBuffer('');
        setLastRegisteredTime(Date.now());
    };

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        const processFrame = async () => {
            if (!isPaused && webcamRef.current && hasCameraAccess) {
                const video = webcamRef.current.video;
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;

                if (videoWidth > 0 && videoHeight > 0) {
                    video.width = videoWidth;
                    video.height = videoHeight;

                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, 300, 300);

                    const imageData = ctx.getImageData(0, 0, 300, 300);
                    const data = imageData.data;

                    const x_ = [];
                    const y_ = [];
                    const dataAux = [];

                    for (let i = 0; i < data.length; i += 4) {
                        const x = (i / 4) % 300;
                        const y = Math.floor((i / 4) / 300);
                        x_.push(x);
                        y_.push(y);
                    }

                    for (let i = 0; i < data.length; i += 4) {
                        const x = (i / 4) % 300;
                        const y = Math.floor((i / 4) / 300);
                        dataAux.push((x - Math.min(...x_)) / 300);
                        dataAux.push((y - Math.min(...y_)) / 300);
                    }

                    // Ensure valid data
                    while (dataAux.length < 42) {
                        dataAux.push(0);
                    }
                    if (dataAux.length > 42) {
                        dataAux.length = 42;
                    }

                    // Send data to backend for prediction
                    try {
                        const response = await fetch('http://127.0.0.1:5000/predict', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ data: dataAux })
                        });
                        const result = await response.json();
                        setCurrentAlphabet(result.predicted_character);

                        // Handle word and sentence formation
                        if (result.predicted_character === ' ') {
                            if (wordBuffer.trim()) { // Speak word only if not empty
                                speakText(wordBuffer);
                                setCurrentSentence(prevSentence => `${prevSentence} ${wordBuffer}`);
                                setCurrentWord('N/A');
                                setWordBuffer('');
                            }
                        } else if (result.predicted_character === '.') {
                            if (wordBuffer.trim()) { // Speak word before adding to sentence
                                speakText(wordBuffer);
                                setCurrentSentence(prevSentence => `${prevSentence} ${wordBuffer}.`);
                                setCurrentWord('N/A');
                                setWordBuffer('');
                            }
                        } else {
                            setCurrentWord(prevWord => `${prevWord}${result.predicted_character}`);
                            setWordBuffer(prevBuffer => `${prevBuffer}${result.predicted_character}`);
                        }

                        // Stabilization logic
                        setStabilizationBuffer(prevBuffer => {
                            const newBuffer = [...prevBuffer, result.predicted_character];
                            if (newBuffer.length > 30) { // Buffer size for 1 second
                                newBuffer.shift();
                            }
                            return newBuffer;
                        });

                        if (stabilizationBuffer.filter(char => char === result.predicted_character).length > 25) { // Stabilization threshold
                            const currentTime = Date.now();
                            if (currentTime - lastRegisteredTime > registrationDelay) {
                                setLastRegisteredTime(currentTime); // Update last registered time
                                setCurrentAlphabet(result.predicted_character);

                                // Handle word and sentence formation
                                if (result.predicted_character === ' ') {
                                    if (wordBuffer.trim()) { // Speak word only if not empty
                                        speakText(wordBuffer);
                                        setCurrentSentence(prevSentence => `${prevSentence} ${wordBuffer}`);
                                        setCurrentWord('N/A');
                                        setWordBuffer('');
                                    }
                                } else if (result.predicted_character === '.') {
                                    if (wordBuffer.trim()) { // Speak word before adding to sentence
                                        speakText(wordBuffer);
                                        setCurrentSentence(prevSentence => `${prevSentence} ${wordBuffer}.`);
                                        setCurrentWord('N/A');
                                        setWordBuffer('');
                                    }
                                } else {
                                    setCurrentWord(prevWord => `${prevWord}${result.predicted_character}`);
                                    setWordBuffer(prevBuffer => `${prevBuffer}${result.predicted_character}`);
                                }
                            }
                        }
                    } catch (error) {
                        console.error("Error sending frame to backend:", error);
                    }
                } else {
                    console.warn("Video dimensions are not set yet.");
                }
            } else {
                console.warn("Camera is paused or not accessible.");
            }

            requestAnimationFrame(processFrame);
        };

        requestAnimationFrame(processFrame);

        return () => {
            // Cleanup: Stop all video tracks when leaving the page
            if (webcamRef.current) {
                const stream = webcamRef.current.srcObject;
                if (stream) {
                    stream.getTracks().forEach((track) => track.stop());
                }
            }
        };
    }, [isPaused, hasCameraAccess, currentWord, currentSentence, stabilizationBuffer, lastRegisteredTime, wordBuffer]);

    const requestCameraAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraAccess(true);

            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            setCameraError(error.message);
            alert(`Failed to access the camera. Error: ${error.message}`);
        }
    };

    useEffect(() => {
        requestCameraAccess();
    }, []);

    return (
        <div style={{ backgroundColor: '#2c2f33', color: '#ffffff', padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Sign Language to Speech Conversion</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#2c2f33', border: '5px solid #ffffff', borderRadius: '10px', padding: '20px', width: '500px', height: '400px' }}>
                    {hasCameraAccess ? (
                        <>
                            <Webcam
                                ref={webcamRef}
                                mirrored={true}
                                screenshotFormat="image/jpeg"
                                width={400}
                                height={300}
                                style={{ borderRadius: '10px' }}
                            />
                            <canvas ref={canvasRef} width={300} height={300} style={{ display: 'none' }}></canvas>
                        </>
                    ) : (
                        <div>
                            <button onClick={requestCameraAccess} style={{ backgroundColor: '#3498db', color: '#ffffff', padding: '10px 20px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                Allow Camera Access
                            </button>
                            {cameraError && (
                                <p style={{ color: '#e74c3c', marginTop: '10px' }}>
                                    Camera Error: {cameraError}
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <div style={{ backgroundColor: '#2c2f33', padding: '20px', width: '400px' }}>
                    <div>
                        <h2>Current Alphabet:</h2>
                        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1abc9c' }}>{currentAlphabet}</p>
                    </div>
                    <div>
                        <h2>Current Word:</h2>
                        <p style={{ fontSize: '20px', color: '#f39c12' }}>{currentWord}</p>
                    </div>
                    <div>
                        <h2>Current Sentence:</h2>
                        <p style={{ fontSize: '20px', color: '#9b59b6' }}>{currentSentence}</p>
                    </div>
                </div>
            </div>
            <div style={{ marginTop: '20px' }}>
                <button onClick={resetSentence} style={{ backgroundColor: '#e74c3c', color: '#ffffff', padding: '10px 20px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Reset Sentence</button>
                <button onClick={togglePause} style={{ backgroundColor: '#3498db', color: '#ffffff', padding: '10px 20px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>{isPaused ? 'Play' : 'Pause'}</button>
                <button onClick={() => speakText(currentSentence)} style={{ backgroundColor: '#27ae60', color: '#ffffff', padding: '10px 20px', margin: '5px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Speak Sentence</button>
            </div>
        </div>
    );
};

export default Gui;