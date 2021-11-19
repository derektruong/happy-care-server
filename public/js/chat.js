const socket = io();

// Elements
const $welcomeLabel = document.querySelector('#welcome-label');
const $sendSubmitButton = document.querySelector('#send-btn');
const $sendLocationButton = document.querySelector('#send-location-btn');
const $messagesTxf = document.querySelector('#txf-message');
const $conversationBox = document.querySelector('#conversation');
const $messages = document.querySelector('#message');
const $users = document.querySelector('#users');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const usersTemplate = document.querySelector('#room-users-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: 'Admin',
    message: 'Welcome',
    createdAt: moment(message.createdAt).format('hh:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

const autoScroll = () => {
  // New messages element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on('publicMessage', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('hh:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('serverBroadcastLocation', (location) => {
  const html = Mustache.render(locationTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format('hh:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('serverSendUsersInRoom', (roomData) => {
  const { room, users } = { ...roomData };
  $users.innerHTML = '';

  users.map((user) => {
    const html = Mustache.render(usersTemplate, {
      username: user.username,
    });
    $users.insertAdjacentHTML('beforeend', html);
  });
});

// handle when submit the form
function formSubmitHandler(event) {
  event.preventDefault();
  // disable send button
  $sendSubmitButton.setAttribute('disabled', 'disabled');

  const message = $messagesTxf.value;

  socket.emit('join-doctor-room', message, () => {
    console.log(message);
	$sendSubmitButton.removeAttribute('disabled');
	$messagesTxf.value = '';
	$messagesTxf.focus();
  });

  //   socket.emit(
  //     'sendMessage',
  //     { username, room, message },
  //     (messageFromServer) => {
  //       // enable send button
  //       console.log(messageFromServer);
  //       $sendSubmitButton.removeAttribute('disabled');
  //       $messagesTxf.value = '';
  //       $messagesTxf.focus();
  //     }
  //   );
}

// handle when send the location
$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }
  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((location) => {
    socket.emit(
      'clientSendLocation',
      {
        username,
        room,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      (messageFromServer) => {
        console.log(messageFromServer);
        $sendLocationButton.removeAttribute('disabled');
      }
    );
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/';
  }
});
