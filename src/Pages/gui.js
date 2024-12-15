// frontend/src/GUI.js
import React, { useEffect, useRef, useState } from 'react';

const GUI = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const speechRef = useRef(null); // Reference for speech synthesis
    const [prediction, setPrediction] = useState('N/A');
    const [currentLetter, setCurrentLetter] = useState('');
    const [word, setWord] = useState('');
    const [sentence, setSentence] = useState('');
    const [isVideoActive, setIsVideoActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [frameCounter, setFrameCounter] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Initialize speech synthesis
    useEffect(() => {
        speechRef.current = window.speechSynthesis;
        return () => {
            if (speechRef.current.speaking) {
                speechRef.current.cancel();
            }
        };
    }, []);

    // Function to speak text
    const speakText = (text) => {
        if (!text || isSpeaking) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        // Cancel any ongoing speech
        if (speechRef.current.speaking) {
            speechRef.current.cancel();
        }

        speechRef.current.speak(utterance);
    };

    useEffect(() => {
        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsVideoActive(true);
                }
            } catch (err) {
                console.error('Error accessing webcam:', err);
                setError(`Error accessing webcam: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        startVideo();

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        let interval;
        if (isVideoActive) {
            interval = setInterval(sendFrameToBackend, 2000);
        }
        return () => clearInterval(interval);
    }, [isVideoActive]);

    const sendFrameToBackend = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (canvas && video) {
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg').split(',')[1];
            const timestamp = frameCounter;

            setFrameCounter(prevCounter => prevCounter + 1);

            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: imageData, timestamp }),
                });

                const result = await response.json();
                if (result.prediction) {
                    setPrediction(result.prediction);
                    setCurrentLetter(result.prediction);
                    handleLetter(result.prediction);
                } else {
                    setPrediction(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error sending frame to backend:', error);
                setPrediction('Error communicating with backend');
            }
        }
    };

    const handleLetter = (letter) => {
        if (letter === 'SPACE') {
            if (word) {
                // Speak the completed word
                speakText(word);
                setSentence(prev => prev + (prev ? ' ' : '') + word);
                setWord('');
            }
        } else if (letter === 'DEL') {
            setWord(prev => prev.slice(0, -1));
        } else if (letter === 'CLEAR') {
            clearSentence();
        } else {
            setWord(prev => prev + letter);
        }
    };

    const toggleVideo = () => {
        setIsVideoActive(!isVideoActive);
    };

    const clearSentence = () => {
        setSentence('');
        setWord('');
        setCurrentLetter('');
        setPrediction('N/A');
        setFrameCounter(0);
        if (speechRef.current.speaking) {
            speechRef.current.cancel();
        }
    };

    // Function to speak current sentence
    const speakSentence = () => {
        const textToSpeak = sentence || word;
        if (textToSpeak) {
            speakText(textToSpeak);
        }
    };

    return (
        <div className="flex flex-col items-center mt-10 bg-gray-100 p-10 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-10 text-gray-700">Real-Time Hand Gesture Recognition</h1>
            <div className="relative w-640 h-480 border-2 border-gray-300 rounded-lg overflow-hidden mb-10">
                {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-75">Loading...</div>}
                {error && <div className="absolute inset-0 flex items-center justify-center bg-red-100 text-red-700 opacity-75">{error}</div>}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    width="640"
                    height="480"
                    className="object-cover w-full h-full"
                    style={{ display: isVideoActive ? 'block' : 'none' }}
                ></video>
                <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    className="hidden"
                ></canvas>
            </div>
            <div className="mt-10 w-640 text-left">
                <p className="text-lg font-bold mb-5">
                    Prediction: <span className="text-blue-500 animate-pulse">{prediction}</span>
                </p>
                <p className="text-lg font-bold mb-5">
                    Current Letter: <span className="text-blue-500">{currentLetter}</span>
                </p>
                <p className="text-lg font-bold mb-5">
                    Word: <span className="text-blue-500">{word}</span>
                </p>
                <p className="text-lg font-bold mb-5">
                    Sentence: <span className="text-blue-500">{sentence}</span>
                </p>
                <div className="flex space-x-5">
                    <button
                        onClick={toggleVideo}
                        className="bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800"
                    >
                        {isVideoActive ? 'Stop Video' : 'Start Video'}
                    </button>
                    <button
                        onClick={clearSentence}
                        className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800"
                    >
                        Clear Sentence
                    </button>
                    <button
                        onClick={speakSentence}
                        disabled={isSpeaking}
                        className={`bg-blue-700 text-white py-2 px-4 rounded-md ${
                            isSpeaking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800'
                        }`}
                    >
                        {isSpeaking ? 'Speaking...' : 'Speak Text'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GUI;