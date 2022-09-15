import React from 'react'
import {Helmet} from 'react-helmet'

export default class Support extends React.Component {
    constructor(props) {
        super(props);
    }

    render(){
        let { t } = this.props;
        return(
            <>
                <Helmet>
                    <title>Support - Original Crash Game</title>
                </Helmet>
                <div style={{ background: 'url(/assets/images/mountain.png)', backgroundSize: 'cover'}} className={'p-4 wheel-content'}>
                    <div className="m-auto text-center">
                        <h2 className={'text-center mb-4'}>Support</h2>
                        <a href={t('support_skype')} className="text-secondary" target="_blank">
                            <img className="img-fluid hvs" src="/assets/images/skype.png" width="150px" />
                        </a>
                        <p className={'text-center text-white mt-4'}>
                            You can stay in touch with us via Skype at 24/7
                        </p>
                    </div>
                </div>
            </>
        );
    }
}