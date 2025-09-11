
// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCxRP4rNfVJRzU8YLrMu51Os9-PfY60Tqk",
    authDomain: "mantenimiento-a-equipo.firebaseapp.com",
    databaseURL: "https://mantenimiento-a-equipo-default-rtdb.firebaseio.com",
    projectId: "mantenimiento-a-equipo",
    storageBucket: "mantenimiento-a-equipo.firebasestorage.app",
    messagingSenderId: "840988363789",
    appId: "1:840988363789:web:47bf961f1ad221529d1944",
    measurementId: "G-NFXY6LLJMR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Evento que se activa al enviar el formulario
document.getElementById('equipmentForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obtiene los valores de los campos del formulario
    const Nombre_del_Equipo = document.getElementById('Nombre_del_Equipo').value;
    const Número_de_Serie = document.getElementById('Número_de_Serie').value;
    const Fecha_de_Mantenimiento = document.getElementById('Fecha_de_Mantenimiento').value;
    const Tipo_de_Mantenimiento = document.getElementById('Tipo_de_Mantenimiento').value;

    // Guarda los datos en Firebase Realtime Database
    try {
        await push(ref(db, 'mantenimientos'), {
            Nombre_del_Equipo,
            Número_de_Serie,
            Fecha_de_Mantenimiento,
            Tipo_de_Mantenimiento
        });
        // Agrega la fila a la tabla localmente
        const tableBody = document.getElementById('maintenanceTable').querySelector('tbody');
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = Nombre_del_Equipo;
        newRow.insertCell(1).textContent = Número_de_Serie;
        newRow.insertCell(2).textContent = Fecha_de_Mantenimiento;
        newRow.insertCell(3).textContent = Tipo_de_Mantenimiento;
        document.getElementById('equipmentForm').reset();
    } catch (error) {
        alert('Error al guardar en Firebase: ' + error.message);
    }
});
