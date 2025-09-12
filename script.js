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

// Obtener referencias al formulario y la tabla
const form = document.getElementById('equipmentForm');
const tableBody = document.querySelector('#maintenanceTable tbody');

// Cargar registros guardados al iniciar
let registros = JSON.parse(localStorage.getItem('mantenimientos')) || [];
renderTable();

// Evento para registrar un nuevo mantenimiento
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const registro = {
        nombre: document.getElementById('Nombre_del_Equipo').value,
        serie: document.getElementById('Número_de_Serie').value,
        fecha: document.getElementById('Fecha_de_Mantenimiento').value,
        tipo: document.getElementById('Tipo_de_Mantenimiento').value
    };
    registros.push(registro);
    localStorage.setItem('mantenimientos', JSON.stringify(registros));
    renderTable();
    form.reset();
});

// Función para mostrar solo los registros guardados en la tabla
function renderTable() {
    tableBody.innerHTML = '';
    if (registros.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="color:#888;">No hay registros de mantenimiento.</td>`;
        tableBody.appendChild(tr);
        return;
    }
    registros.forEach((reg, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.nombre}</td>
            <td>${reg.serie}</td>
            <td>${reg.fecha}</td>
            <td>${reg.tipo}</td>
            <td>
                <button class="eliminar" data-idx="${idx}" title="Eliminar registro">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.onclick = function() {
            const idx = this.getAttribute('data-idx');
            registros.splice(idx, 1);
            localStorage.setItem('mantenimientos', JSON.stringify(registros));
            renderTable();
        };
    });
}