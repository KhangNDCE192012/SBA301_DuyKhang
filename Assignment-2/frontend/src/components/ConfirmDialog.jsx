export default function ConfirmDialog({
                                          message,
                                          onConfirm,
                                          onCancel
                                      }) {

    return (
        <div className="modal-overlay">

            <div className="confirm-box">

                <div className="confirm-icon">!</div>

                <h3>Confirm deletion</h3>

                <p>{message}</p>

                <div className="modal-footer">

                    <button
                        className="btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn-danger"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}