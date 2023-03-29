import React from 'react';
import './Message.scss'
import { messageData, UserAgent } from '../scripts/globalInterface';



 const Message = ({messageData, ua}: {messageData:messageData, ua:UserAgent}) => {
    return (
        <div className={'message right' }>
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