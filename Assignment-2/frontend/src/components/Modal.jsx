
export default function Modal({
                                  title,
                                  children,
                                  onClose,
                                  onSubmit,
                                  submitText = "Save"
                              }) {

    return (

        <div
            className="modal-overlay"

            onMouseDown={(e) => {

                if (e.target === e.currentTarget) {
                    onClose();
                }

            }}
        >

            <div className="modal-box">

                {/* MODAL HEADER */}

                <div className="modal-header">

                    <h2>
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                {/* MODAL FORM */}

                <form
                    onSubmit={(e) => {

                        e.preventDefault();

                        onSubmit();

                    }}
                >

                    {/* FORM CONTENT */}

                    <div className="modal-body">

                        {children}

                    </div>

                    {/* MODAL FOOTER */}

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            {submitText}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}
