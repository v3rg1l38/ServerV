const message = document.getElementById('close-message');

if(message) {
    message.onclick = () => {
        const mess = document.getElementById('mess');
        mess.remove();
    }    
}