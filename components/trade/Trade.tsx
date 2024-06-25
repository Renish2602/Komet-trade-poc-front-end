import { useEffect, useState } from 'react';
import { tradeSocket } from '@/socket/socket';

const Trade = () => {
    const [messages, setMessages] = useState<string[]>([
        'Connecting to Backend..'
    ]);
    const [jsonString, setJsonString] = useState<object | null>(null);

    const appendLogs = (message: string) => {
        setMessages(prevMessages => {
            const messageSet = new Set(prevMessages);
            messageSet.add(message);
            return Array.from(messageSet);
        });
    };

    const connectTrade = () => {
        appendLogs('Connected to Backend...');
    }

    useEffect(() => {

        tradeSocket.on('trade', (data) => {
            if (data != null && data?.ticket != null) {
                appendLogs(`Displaying Trade Details : ${data?.ticket}`);
                setJsonString(data)
            }
        });
        tradeSocket.on('logger', (data) => {
            appendLogs(data);
        });
        tradeSocket.on("connect", connectTrade);

        tradeSocket.on('disconnect', () => {
            console.log('Disconnected from Socket.io server');
        });

        return () => {
            tradeSocket.off('connect');
            tradeSocket.off('logger');
            tradeSocket.off('trade');
            tradeSocket.off('disconnect');
        }

    }, []);

    const handleClick = () => {
        const req = {};
        const messagesData = messages.slice(0,2);
        setMessages(messagesData);
        setJsonString(null);
        tradeSocket.emit('generateTrade', req);
    }

    return (
        <>
            <div className="w-full rounded overflow-hidden shadow-lg bg-gray-100 p-5">
                <div className="w-full flex flex-row justify-between gap-10">
                    <div className="w-full bg-gray-300 p-3 min-h-40 h-auto">
                        <h1 className='text-xl text-white font-medium'>Your Trade Details</h1>
                        <textarea
                            className='bg-gray-300 text-xl font-medium text-white w-full'
                            value={jsonString ? JSON.stringify(jsonString, null, 2) : ''}
                            rows={15}
                            cols={30}
                            readOnly
                        />
                    </div>
                    <div className="w-full text-white">
                        {messages?.map((item, index) => (
                            <div key={index}>
                                <h6 className='text-base'>{item}</h6>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mt-3">
                    <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
                        Trade
                    </button>
                </div>
            </div>
        </>
    )
};

export default Trade;