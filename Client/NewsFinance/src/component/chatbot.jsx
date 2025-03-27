import './chatbot.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import http from '../helpers/axios'; 


function FinanceChatbot() {
    const [question, setQuestion] = useState('');  
    const [response, setResponse] = useState('');   
    const [loading, setLoading] = useState(false);  
    const [isChatbotOpen, setIsChatbotOpen] = useState(true);

    const toggleChatbot = () => {
        setIsChatbotOpen((state) => !state);
    }

    const handleAskQuestion = async () => {
        setLoading(true); 
        try {
            const res = await http({
                method: 'POST',
                url: '/ask',  
                data: {
                    question: question
                }
            });

            setResponse(res.data.message); 
            setLoading(false); 
        } catch (error) {
            console.error(error);
            setLoading(false);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong with your request.',
                icon: 'error'
            });
        }
    };

    return (
        <>
        {isChatbotOpen && (
            <div className="chatbot-container">
            <div className="chatbot-box">
                <h2>Finance Chatbot</h2>
                <input
                    type="text"
                    placeholder="Ask a finance-related question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)} 
                />
                <button onClick={handleAskQuestion} disabled={loading}>
                    {loading ? 'Loading...' : 'Ask'}
                </button>

                {response && (
                    <div className="response">
                        <h3>Response:</h3>
                        <p>{response}</p>
                    </div>
                )}
            </div>
        </div>
        )}
        <button onClick={toggleChatbot} className="toggle-chat-btn">
            {isChatbotOpen ? 'Hide Chat' : 'Open Chat'}
        </button>
        </>
        
        
    );
}

export default FinanceChatbot;