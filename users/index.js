const socket = io('http://localhost:5050', {
	path: '/real-time',
});

const formPassanger = document.getElementById('form-login');
const divLogin = document.getElementById('sectionLogin');
const divTrip = document.getElementById('sectionTrip');
formPassanger.addEventListener('submit', (event) => {
	event.preventDefault();
	const namePassanger = document.getElementById('name');
	socket.emit('Client:Login', {
		name: namePassanger.value,
		role: 'passanger',
	});
	localStorage.setItem('login', namePassanger.value);
	alert('Login successful');
	divLogin.style.display = 'none';
	namePassanger.value = '';
	divTrip.style.display = 'block';
});

const driversContainer = document.getElementById('drivers');
socket.on('Server:UpdateActiveCars', (activeCars) => {
	driversContainer.innerHTML = '';
	if (activeCars.length === 0) {
		driversContainer.innerHTML = 'No drivers availables';
	} else {
		activeCars.forEach((car) => {
			const carElement = document.createElement('div');
			carElement.classList.add('driver-item');
			carElement.textContent = `${car.name} - ${car.plate}`;
			driversContainer.appendChild(carElement);
		});
	}
});

const formTrip = document.getElementById('form-trip');
const pTrip = document.getElementById('p-trip');
formTrip.addEventListener('submit', (event) => {
	event.preventDefault();
	const originPassanger = document.getElementById('origin');
	const destinationnPassanger = document.getElementById('destination');
	const login = localStorage.getItem('login');
	socket.emit('Client:NewTrip', {
		origin: originPassanger.value,
		destination: destinationnPassanger.value,
		name: login,
	});
	formTrip.style.display = 'none';
	originPassanger.value = '';
	destinationnPassanger.value = '';
	pTrip.innerHTML = 'Looking for drivers...';
});

const divInitTrip = document.getElementById('div-init-trip');
const pInitTrip = document.getElementById('p-init-trip');
socket.on('Server:TripAccepted', ({ message, tripId }) => {
	divTrip.style.display = 'none';
	divInitTrip.style.display = 'block';
	pInitTrip.innerHTML = 'Waiting for the driver to start the trip...';
	alert(message);
});

const divInfoTrip = document.getElementById('info-trip');
socket.on('Server:TripStarted', ({ message, dataTrip }) => {
	pInitTrip.innerHTML = '';
	pInitTrip.innerHTML = message;
	alert('The trip has started!');
	divInfoTrip.innerHTML = `
	<p>Conductor: ${dataTrip.driver} - ${dataTrip.plate}</p>
	<p>Origen: ${dataTrip.origin}</p>
	<p>Destino: ${dataTrip.destination}</p>
	<p>Estado: ${dataTrip.status}</p>
	`;
});

socket.on('Server:TripFinished', ({ message, dataTrip }) => {
	pInitTrip.innerHTML = '';
	pInitTrip.innerHTML = message;
	alert('The trip has finished');
	divInfoTrip.innerHTML = '';

	divInitTrip.style.display = 'none';
	divTrip.style.display = 'block';
	formTrip.style.display = 'block';
});
