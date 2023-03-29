import React from 'react';
import './Message.scss'
import { messageData, UserAgent } from '../scripts/globalInterface';



 const Message = ({isAuthor, messageData, ua}: {isAuthor:string ,messageData:messageData, ua:UserAgent}) => {
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