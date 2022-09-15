import React, { Component } from "react";
import { Link } from "react-router-dom";

class NotFound extends Component{
    render() {
        return <>
            <body className="py-5 ovh">
            <div className="py-3 text-center">
                <div className="container d-flex flex-column">
                    <div className="row my-auto">
                        <div className="col-md-12 text-white">
                            <img src="/assets/images/illustrations/404.svg" className={'img-fluid'} alt=""/>
                            <h2 className="mb-4 py-5">[ Page Not Found or You are not allowed to view this page ]</h2>
                            <Link to="/" className="btn btn-soft-danger btn-lg font-17 mt-4"><i className="mdi mdi-play" /> Go Back to Home</Link>
                        </div>
                    </div>
                </div>
            </div>
            </body>
        </>
    }
}

export default NotFound;