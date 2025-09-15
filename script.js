// Importa las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
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

// Referencia a la tabla y formulario
const form = document.getElementById('equipmentForm');
const tableBody = document.querySelector('#maintenanceTable tbody');
const dashboardStats = document.getElementById('dashboard-stats');

let maintenanceChart = null; // Variable para almacenar la instancia del gráfico

// Actualizar el dashboard con estadísticas
function updateDashboard(data) {
    const totalRecords = Object.keys(data).length;
    const maintenanceTypes = {};

    for (const key in data) {
        const type = data[key].Tipo_de_Mantenimiento;
        if (maintenanceTypes[type]) {
            maintenanceTypes[type]++;
        } else {
            maintenanceTypes[type] = 1;
        }
    }

    let statsHTML = `<p><strong>Total de Registros:</strong> ${totalRecords}</p>`;
    statsHTML += `<p><strong>Desglose por Tipo:</strong></p><ul>`;
    for (const type in maintenanceTypes) {
        statsHTML += `<li>${type}: ${maintenanceTypes[type]}</li>`;
    }
    statsHTML += `</ul>`;

    dashboardStats.innerHTML = statsHTML;

    // --- Lógica para el gráfico ---
    const chartCanvas = document.getElementById('maintenanceChart').getContext('2d');
    const chartLabels = Object.keys(maintenanceTypes);
    const chartData = Object.values(maintenanceTypes);

    // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
    if (maintenanceChart) {
        maintenanceChart.destroy();
    }

    // Creamos una nueva instancia del gráfico
    maintenanceChart = new Chart(chartCanvas, {
        type: 'doughnut', // Tipo de gráfico
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Tipos de Mantenimiento',
                data: chartData,
                backgroundColor: [ // Colores para cada sección del gráfico
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                ],
                borderColor: [ // Colores de los bordes
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        }
    });
}

// Mostrar los registros de Firebase en la tabla
function renderTableFirebase(snapshot) {
    tableBody.innerHTML = '';
    if (!snapshot.exists()) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="color:#888;">No hay registros de mantenimiento.</td>`;
        tableBody.appendChild(tr);
        return;
    }
    const data = snapshot.val();
    updateDashboard(data); // Actualiza el dashboard

    const keys = Object.keys(data);
    keys.forEach(key => {
        const reg = data[key];

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.Nombre_del_Equipo}</td>
            <td>${reg.Número_de_Serie}</td>
            <td>${reg.Fecha_de_Mantenimiento}</td>
            <td>${reg.Tipo_de_Mantenimiento}</td>
            <td>
                <button class="eliminar" data-key="${key}" title="Eliminar registro">🗑️</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    // Asignar eventos a los botones de eliminar
    document.querySelectorAll('.eliminar').forEach(btn => {
        btn.onclick = function() {
            const key = this.getAttribute('data-key');
            remove(ref(db, 'mantenimientos/' + key));
        };
    });
}

// Escuchar cambios en Firebase y actualizar la tabla en tiempo real
onValue(ref(db, 'mantenimientos'), renderTableFirebase);

// Evento para registrar un nuevo mantenimiento
form.addEventListener('submit', async function (event) {
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
        form.reset();
    } catch (error) {
        alert('Error al guardar en Firebase: ' + error.message);
    }
}); 
