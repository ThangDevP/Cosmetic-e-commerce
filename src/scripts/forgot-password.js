const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('send-email').value;
  
    fetch(`/api/users?email=${email}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(users => {
        console.log(users, "users");
        if (users.length > 0) {
        const user = users[0]; 
        
        const password = user.password;
        const name = user.username;
          fetch('/send-email-forgot-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password, name: name }),
          })
          .then(responses => {
            if (!responses.ok) {
              console.error('Có lỗi xảy ra khi gửi email.');
              // Hiển thị thông báo lỗi nếu gửi email không thành công
              alert('Có lỗi xảy ra khi gửi email.');
            } else {
              console.log('Email đã được gửi đi!');
              // Hiển thị thông báo khi email đã được gửi thành công
              alert('Kiểm tra hộp thư của bạn để lấy lại mật khẩu.');
            }
          })
          .catch(error => {
            console.error('Có lỗi xảy ra:', error);
          });
        } else {
          console.error('Tài khoản không tồn tại!');
          alert('Tài khoản không tồn tại!');
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });

  });



