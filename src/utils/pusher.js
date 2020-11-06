import Pusher from 'pusher-js'

    Pusher.logToConsole = true;
    const pusher = new Pusher('7d626b38a5cc6c22c4ad', {
      cluster: 'eu'
    });

    export default pusher;