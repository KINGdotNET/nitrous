import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseButton from 'app/components/elements/CloseButton';
import Reveal from 'app/components/elements/Reveal';
import Reveal2 from 'app/components/elements/Swap/SelectedReveal';

import { Map, List } from 'immutable';
import * as globalActions from 'app/redux/GlobalReducer';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import QrReader from 'app/components/elements/QrReader';
import CheckLoginOwner from 'app/components/elements/CheckLoginOwner';
import PromotePost from 'app/components/modules/PromotePost';
import RequestKRWPVoting from 'app/components/modules/RequestKRWPVoting';
import ExplorePost from 'app/components/modules/ExplorePost';
import RatePost from 'app/components/modules/RatePost';
import RewardPost from 'app/components/modules/RewardPost';
import SelectedPool from 'app/components/elements/Swap/SelectedPool';
import SelectedToken from 'app/components/elements/Swap/SelectedToken';
import Loading from 'app/components/elements/Swap/Loading';

class Dialogs extends React.Component {
    static propTypes = {
        active_dialogs: PropTypes.object,
        hide: PropTypes.func.isRequired,
    };
    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Dialogs');
        this.hide = name => {
            this.props.hide(name);
        };
    }
    componentWillReceiveProps(nextProps) {
        const { active_dialogs, hide } = nextProps;
        active_dialogs.forEach((v, k) => {
            if (!this['hide_' + k]) this['hide_' + k] = () => hide(k);
        });
    }
    render() {
        const { active_dialogs } = this.props;
        let idx = 0;
        const dialogs = active_dialogs.reduce((r, v, k) => {
            const cmp =
                k === 'qr_reader' ? (
                    <span key={idx++}>
                        <Reveal
                            onHide={this['hide_' + k]}
                            show
                            revealStyle={{ width: '355px' }}
                        >
                            <CloseButton onClick={this['hide_' + k]} />
                            <QrReader
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : k === 'promotePost' ? (
                    <span key={idx++}>
                        <Reveal onHide={this['hide_' + k]} show>
                            <CloseButton onClick={this['hide_' + k]} />
                            <PromotePost
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : k === 'requestKRWPVoting' ? (
                    <span key={idx++}>
                        <Reveal onHide={this['hide_' + k]} show>
                            <CloseButton onClick={this['hide_' + k]} />
                            <RequestKRWPVoting
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : k === 'loading' ? (
                    <span key={idx++}>
                        <Reveal show>
                            <Loading
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : k === 'selectedMode' ? (
                    <span key={idx++}>
                        <Reveal2 onHide={this['hide_' + k]} show>
                            <SelectedPool
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal2>
                    </span>
                ) : k === 'selectedToken' ? (
                    <span key={idx++}>
                        <Reveal
                            onHide={this['hide_' + k]}
                            show
                            isSwapModal={true}
                        >
                            <CloseButton onClick={this['hide_' + k]} />
                            <SelectedToken
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : k === 'ratePost' ? (
                    <span key={idx++}>
                        <Reveal onHide={this['hide_' + k]} show>
                            <CloseButton onClick={this['hide_' + k]} />
                            <RatePost
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : k === 'rewardPost' ? (
                    <span key={idx++}>
                        <Reveal onHide={this['hide_' + k]} show>
                            <CloseButton onClick={this['hide_' + k]} />
                            <RewardPost
                                onClose={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : k === 'explorePost' ? (
                    <span key={idx++}>
                        <Reveal onHide={this['hide_' + k]} show>
                            <CloseButton onClick={this['hide_' + k]} />
                            <ExplorePost
                                onClick={this['hide_' + k]}
                                {...v.get('params').toJS()}
                            />
                        </Reveal>
                    </span>
                ) : null;
            return cmp ? r.push(cmp) : r;
        }, List());
        return (
            <div>
                {dialogs.toJS()}
                <CheckLoginOwner />
            </div>
        );
    }
}

const emptyMap = Map();

export default connect(
    state => {
        return {
            active_dialogs: state.global.get('active_dialogs') || emptyMap,
        };
    },
    dispatch => ({
        hide: name => {
            dispatch(globalActions.hideDialog({ name }));
        },
    })
)(Dialogs);
