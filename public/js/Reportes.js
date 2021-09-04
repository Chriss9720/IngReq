let horientazion1 = true;
let horientazion2 = true;
let horientazion3 = true;

const Ganancias = () => {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'dia');
    data.addColumn('number', 'Comprado');
    data.addColumn('number', 'Vendido');

    let datos = [];
    datos.push(['2014', 1000, 400]);
    datos.push(['2015', 1170, 460]);
    datos.push(['2016', 660, 1120]);
    datos.push(['2017', 1030, 540]);
    datos.push(['2018', 1030, 540]);

    datos.forEach(item => data.addRows([item]));

    let h = (horientazion1) ? "vertical" : "horizontal";

    var options = {
        chart: {
            title: 'Ventas de la compañia',
            subtitle: 'Seleccione una barra para ver detalles',
        },
        bars: h,
        vAxis: { format: 'decimal' },
        height: 400,
        colors: ['#1b9e77', '#d95f02']
    };

    var chart = new google.charts.Bar(document.getElementById('chart_div'));

    function selectHandler() {
        if (chart.getSelection()[0]) {
            let row = chart.getSelection()[0].row;
            let datos = data.Wf[row].c;
            model(`Ganancias en el periodo: ${datos[0].v}`);
        }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);

    chart.draw(data, google.charts.Bar.convertOptions(options));

    var btns = document.getElementById('btn-group');

    btns.onclick = function(e) {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.id != "diseño_1") {
                options.vAxis.format = e.target.id === 'none' ? '' : e.target.id;
                chart.draw(data, google.charts.Bar.convertOptions(options));
            }
        }
    }
};

const MasVentas = () => {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Comprado', 'Vendido'],
        ['2014', 1000, 400],
        ['2015', 1170, 460],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2017', 1030, 540]
    ]);

    var options = {
        chart: {
            title: 'Productos mas vendidos',
            subtitle: 'Seleccione una barra para ver detalles',
        },
        bars: (horientazion2) ? "vertical" : "horizontal",
        vAxis: { format: 'decimal' },
        height: 400,
        colors: ['#1b9e77', '#d95f02']
    };

    var chart = new google.charts.Bar(document.getElementById('chart_div_MasVentas'));

    function selectHandler() {
        if (chart.getSelection()[0]) {
            let row = chart.getSelection()[0].row;
            let datos = data.Wf[row].c;
            model(`Mas Ventas en el periodo: ${datos[0].v}`);
        }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, google.charts.Bar.convertOptions(options));

    var btns = document.getElementById('btn-group_MasVentas');

    btns.onclick = function(e) {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.id != "diseño_2") {
                options.vAxis.format = e.target.id === 'none' ? '' : e.target.id;
                chart.draw(data, google.charts.Bar.convertOptions(options));
            }
        }
    }
};

const MenosVentas = () => {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Comprado', 'Vendido'],
        ['2014', 1000, 400],
        ['2015', 1170, 460],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2016', 660, 1120],
        ['2017', 1030, 540]
    ]);

    var options = {
        chart: {
            title: 'Productos menos vendidos',
            subtitle: 'Seleccione una barra para ver detalles',
        },
        bars: (horientazion3) ? "vertical" : "horizontal",
        vAxis: { format: 'decimal' },
        height: 400,
        colors: ['#1b9e77', '#d95f02']
    };

    var chart = new google.charts.Bar(document.getElementById('chart_div_MenosVentas'));

    function selectHandler() {
        if (chart.getSelection()[0]) {
            let row = chart.getSelection()[0].row;
            let datos = data.Wf[row].c;
            model(`Menos ventas en el periodo: ${datos[0].v}`);
        }
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);
    chart.draw(data, google.charts.Bar.convertOptions(options));

    var btns = document.getElementById('btn-group_MenosVentas');

    btns.onclick = function(e) {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.id != "diseño_3") {
                options.vAxis.format = e.target.id === 'none' ? '' : e.target.id;
                chart.draw(data, google.charts.Bar.convertOptions(options));
            }
        }
    }
};

google.charts.load('current', { 'packages': ['bar'] });

window.addEventListener("resize", () => init());

const init = () => {
    google.charts.setOnLoadCallback(Ganancias);
    google.charts.setOnLoadCallback(MasVentas);
    google.charts.setOnLoadCallback(MenosVentas);
};

init();

const model = (titulo) => {
    $('#reportes').modal({ show: true });
    document.getElementById('TituloMensaje').innerText = titulo;
};

$('#diseño_1').click(() => {
    horientazion1 = !horientazion1;
    Ganancias();
});

$('#diseño_2').click(() => {
    horientazion2 = !horientazion2;
    MasVentas();
});

$('#diseño_3').click(() => {
    horientazion3 = !horientazion3;
    MenosVentas();
});

$('#GananciasPDF').click(() => {
    let info = document.getElementById('chart_div').innerHTML;
    let w = window.open();
    w.document.write("<h1>Ganancias vs Compras en el priodo</h1>");
    w.document.write(info);
    w.document.close();
    w.focus();
    w.print();
    w.close();
});

$('#MasVendidosPDF').click(() => {
    console.log("KCAS");
    let info = document.getElementById('chart_div_MasVentas').innerHTML;
    let w = window.open();
    w.document.write("<h1>Mas vendidos en el priodo</h1>");
    w.document.write(info);
    w.document.close();
    w.focus();
    w.print();
    w.close();
});

$('#MenosVendidosPDF').click(() => {
    let info = document.getElementById('chart_div_MenosVentas').innerHTML;
    let w = window.open();
    w.document.write("<h1>Menos vendidos en el priodo</h1>");
    w.document.write(info);
    w.document.close();
    w.focus();
    w.print();
    w.close();
});

$('#ReporteCompleto').click(() => {
    let info1 = document.getElementById('chart_div').innerHTML;
    let info2 = document.getElementById('chart_div_MasVentas').innerHTML;
    let info3 = document.getElementById('chart_div_MenosVentas').innerHTML;
    let w = window.open();
    w.document.write("<h1>Ganancias vs Compras en el priodo</h1>");
    w.document.write(info1);
    w.document.write("<h1>Mas vendidos en el priodo</h1>");
    w.document.write(info2);
    w.document.write("<h1>Menos vendidos en el priodo</h1>");
    w.document.write(info3);
    w.document.close();
    w.focus();
    w.print();
    w.close();
});

$('#tablaModal_1').click(() => {
    let info = document.getElementById('Tabla_datos_1').innerHTML;
    let titulo = document.getElementById('TituloMensaje').innerText;
    let w = window.open();
    w.document.write(`<h1>${titulo}</h1>`);
    w.document.write(info);
    w.document.close();
    w.focus();
    w.print();
    w.close();
});