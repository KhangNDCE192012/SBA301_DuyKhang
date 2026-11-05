/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Component Modal dùng chung để hiển thị hộp thoại tạo mới hoặc chỉnh sửa dữ liệu.
 * Nhận vào tiêu đề, nội dung form (children), hàm đóng (onClose) và hàm submit (onSubmit).
 * Click ra ngoài vùng modal-box sẽ đóng modal.
 * Được sử dụng trong AccountManagement, CategoryManagement và NewsManagement.
 */

/**
 * @param {string} title - tiêu đề hiển thị ở đầu modal
 * @param {ReactNode} children - nội dung form bên trong modal
 * @param {Function} onClose - hàm gọi khi đóng modal (nút ×, nút Cancel, click ngoài)
 * @param {Function} onSubmit - hàm gọi khi submit form (nút Save/Create/Update)
 * @param {string} submitText - nhãn của nút submit, mặc định là "Save"
 */
export default function Modal({
                                  title,
                                  children,
                                  onClose,
                                  onSubmit,
                                  submitText = "Save"
                              }) {

    return (

        // Lớp phủ nền mờ bao phủ toàn màn hình; click vào nền → đóng modal
        <div
            className="modal-overlay"

            onMouseDown={(e) => {
                // Chỉ đóng modal khi click trực tiếp vào overlay, không phải vào modal-box
                if (e.target === e.currentTarget) {
                    onClose();
                }

            }}
        >

            <div className="modal-box">

                {/* PHẦN ĐẦU MODAL: tiêu đề và nút đóng × */}

                <div className="modal-header">

                    <h2>
                        {title}
                    </h2>

                    {/* Nút × góc phải: click → gọi onClose() để đóng modal */}
                    <button
                        type="button"
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                {/* PHẦN FORM: bọc toàn bộ nội dung và footer trong thẻ form */}

                <form
                    onSubmit={(e) => {

                        // Ngăn reload trang mặc định khi submit form HTML
                        e.preventDefault();

                        // Gọi hàm onSubmit được truyền từ component cha (handleSave)
                        onSubmit();

                    }}
                >

                    {/* PHẦN THÂN MODAL: render children (các input, select, textarea...) */}

                    <div className="modal-body">

                        {children}

                    </div>

                    {/* PHẦN CUỐI MODAL: nút Cancel và nút Submit */}

                    <div className="modal-footer">

                        {/* Nút Cancel: click → gọi onClose() để hủy và đóng modal */}
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        {/* Nút Submit (Save/Create/Update): type="submit" kích hoạt onSubmit của form */}
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
