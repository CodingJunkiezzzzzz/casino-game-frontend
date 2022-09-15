import React, {useState} from "react";
import { Modal } from "react-bootstrap";

function Rules(props) {
    const [show, setShow] = useState(false);
  
    let css = 'pulse';

    const handleShow = () => setShow(true);

    const handleClose = () => {
        css = 'zoomOut';
        setShow(false)
    };

    const { t } = props;
    return (
        <>
            <li className={"float-right"}>
                <button className={"btn btn-xs hvi mt-3"} onClick={handleShow}>
                    <i className="mdi mdi-information-outline font-20" />
                </button>
            </li>
            <Modal 
            	show={show} 
            	onHide={handleClose}
            	centered={true}
            	backdrop={"static"} 
            	className={"animated " + css}>
                <Modal.Header>
                    {t("chat_rules")}
                    <button type="button" className="close p-2" onClick={handleClose}>
                        <i className={"mdi mdi-close"} />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <ul className="font-15 p-0 text-white" style={{ lineHeight: "30px" }}>
                        <li>1. {t("r2")}</li>
                        <li>2. {t("r3")}</li>
                        <li>3. {t("r4")}</li>
                        <li>4. {t("r5")}</li>
                        <li>5. {t("r0")} : @Support</li>
                    </ul>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Rules;