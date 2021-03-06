import { List, Set } from 'immutable';
import React from 'react';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import ChatLayout from 'app/components/modules/chat/ChatLayout';
import { imageProxy } from 'app/utils/ProxifyUrl';
import * as chatActions from 'app/redux/ChatReducer';
import { Avatar, ChatList, ChatListItem, Column, Row, Title } from '@livechat/ui-kit';

class ChatListSelect extends React.PureComponent {

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const {
            username,
            accessToken,
            chatList,
            socketState,
            login,
            fetchChatList,
            connectWebsocket,
            onSelect,
        } = this.props;
        if (!accessToken) {
            login(username);
        } else {
            if (!chatList) {
                fetchChatList();
            } else if (socketState !== 'ready') {
                connectWebsocket();
            }
        }
    }

    render() {
        const { 
            loading,
            minimize,
            chatList,
            onSelect,
            username,
            setNewConversation,
        } = this.props;
        const title = "BeeChat Conversations";
        if (loading) {
            return (
               <ChatLayout title={title} minimize={minimize}>
                   <div
                       style={{
                           flexGrow: 1,
                           minHeight: 0,
                           height: '100%',
                           background: '#fff',
                       }}
                   >
                       <center>
                           <LoadingIndicator
                               style={{ marginBottom: '2rem' }}
                               type="circle"
                           />
                       </center>
                   </div>
               </ChatLayout>
            );
        }
        const otherMembers = (c) => c.members.filter(m => m !== username);
        return (
            <ChatLayout title={title} minimize={minimize}>
                <div className='ChatListBackground'>
                    <ChatList style={{overflowY: 'auto'}}>
                        {chatList ? chatList.toJS().map(chat => (
                            <ChatListItem key={chat.id} onClick={() => onSelect(chat)}>
                                <Avatar
                                    letter={(chat.name ? chat.name : otherMembers(chat)[0])[0]}
                                    imgUrl={!chat.name && chat.members && otherMembers(chat).length == 1 ? `${imageProxy()}u/${otherMembers(chat)[0]}/avatar/small` : null}
                                />
                                <Column fill>
                                    <Row justify>
                                        <Title ellipses>
                                            {chat.name || otherMembers(chat).join(', ')}
                                        </Title>
                                    </Row>
                                </Column>
                            </ChatListItem>
                        )) : []}
                    </ChatList>
                    <Row style={{justifyContent: 'center'}}>
                        <button
                            className="button"
                            style={{marginTop: '0.5em', marginBottom: '3em'}}
                            onClick={() => setNewConversation(true)}
                        >
                            New Conversation
                        </button>
                    </Row>
                </div>
            </ChatLayout>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentAccount = state.user.get('current');
        const username = currentAccount.get('username');
        const accessToken = state.chat.getIn(['accessToken', username]);
        const chatList = state.chat.get('chatList');
        const socketState = state.chat.get('socketState');
        const loading = !accessToken || !chatList || socketState !== 'ready';
        return {
            ...ownProps,
            username,
            accessToken,
            chatList,
            socketState,
            loading,
        };
    },
    dispatch => ({
        login: (username) => {
            dispatch(chatActions.login({ username }));
        },
        fetchChatList: () => {
            dispatch(chatActions.fetchChatList());
        },
        connectWebsocket: () => {
            dispatch(chatActions.connectWebsocket());
        },
    }),
)(ChatListSelect);
