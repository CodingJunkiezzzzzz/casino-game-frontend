import React from "react";
import ReactTooltip from "react-tooltip";

export default class Social extends React.Component {
    render(){
        const { t } = this.props;
        return(
            <>
                <span className="btn-social-icon">
                    <ReactTooltip />
                    <a href={t('facebook')} target={'_blank'} data-tip={'FaceBook Page'}>
                        <i className={'mdi mdi-facebook-box font-25'} style={{ color: 'rgb(93 120 127)' }} />
                    </a>
                    <a href={t('twitter')} target={'_blank'} data-tip={'Twitter News'}>
                        <i className={'mdi mdi-twitter-box font-25'} style={{ color: 'rgb(93 120 127)' }} />
                    </a>
                    <a href={t('discord')} target={'_blank'} data-tip={'Discord Page'}>
                        <i className={'mdi mdi-discord font-25'} style={{ color: 'rgb(93 120 127)' }} />
                    </a>
                    <a href={t('dribble')} target={'_blank'} data-tip={'Follow us on Dribble'}>
                        <i className={'mdi mdi-dribbble-box font-25'} style={{ color: 'rgb(93 120 127)' }} />
                    </a>
                    <a href={t('medium')} target={'_blank'} data-tip={'Medium'}>
                        <i className={'mdi mdi-quality-medium font-25'} style={{ color: 'rgb(93 120 127)' }} />
                    </a>
                </span>
            </>
        );
    }
}