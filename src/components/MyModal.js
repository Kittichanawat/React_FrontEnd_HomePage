function Mymodal(props) {
    return (
        <>
            <div className="modal fade" tabIndex="-1" id={props.id} aria-labelledby={`${props.id}Label`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`${props.id}Label`}>{props.title}</h5>
                            <button 
                                id={`${props.id}_btnClose`} 
                                type="button" 
                                className="btn-close" 
                                data-bs-dismiss="modal" 
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                          {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Mymodal;
