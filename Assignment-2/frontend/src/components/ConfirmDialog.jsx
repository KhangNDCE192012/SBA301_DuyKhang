/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Component hộp thoại xác nhận xóa dữ liệu (ConfirmDialog).
 * Hiển thị thông báo cảnh báo và hai nút: Cancel (hủy) và Delete (xác nhận xóa).
 * Được sử dụng trong AccountManagement, CategoryManagement và NewsManagement
 * khi người dùng nhấn nút Delete trên một dòng dữ liệu.
 */

/**
 * @param {string} message - nội dung thông báo xác nhận hiển thị cho người dùng
 * @param {Function} onConfirm - hàm gọi khi người dùng nhấn nút "Delete" (xác nhận xóa)
 * @param {Function} onCancel - hàm gọi khi người dùng nhấn nút "Cancel" (hủy bỏ)
 */
export default function ConfirmDialog({
                                          message,
                                          onConfirm,
                                          onCancel
                                      }) {

    return (
        // Lớp phủ nền mờ hiển thị bên trên toàn bộ nội dung trang
        <div className="modal-overlay">

            <div className="confirm-box">

                {/* Icon cảnh báo "!" */}
                <div className="confirm-icon">!</div>

                {/* Tiêu đề hộp thoại */}
                <h3>Confirm deletion</h3>

                {/* Nội dung thông báo xác nhận được truyền từ component cha */}
                <p>{message}</p>

                <div className="modal-footer">

                    {/* Nút Cancel: click → gọi onCancel() để đóng dialog, không xóa */}
                    <button
                        className="btn-secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    {/* Nút Delete: click → gọi onConfirm() → thực hiện xóa dữ liệu */}
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
