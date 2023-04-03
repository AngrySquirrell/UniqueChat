import React from 'react';
import './Message.scss'
import { messageData, UserAgent } from '../scripts/globalInterface';



 const Message = ({isAuthor, messageData}: {isAuthor:string ,messageData:messageData}) => {
    return (
        <div className={'message ' + isAuthor }>
            <div className='author'>
                {messageData.authorName}
            </div>
            <div className='content'>
                {messageData.content}
            </div>
        </div>
    );
};

export default Message;