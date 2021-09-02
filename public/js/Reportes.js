let horientazion1 = true;
let horientazion2 = true;
let horientazion3 = true;

const Ganancias = () => {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Comprado', 'Vendido'],
        ['2014', 1000, 400],
        ['2015', 1170, 460],
        ['2016', 660, 1120],
        ['2017', 1030, 540]
    ]);

    var options = {
        chart: {
            title: 'Ventas de la compañia',
            subtitle: 'Seleccione una barra para ver detalles',
        },
        bars: (horientazion1) ? "vertical" : "horizontal",
        vAxis: { format: 'decimal' },
        height: 400,
        colors: ['#1b9e77', '#d95f02']
    };

    var chart = new google.charts.Bar(document.getElementById('chart_div'));

    function selectHandler() {
        let row = chart.getSelection()[0].row;
        let col = chart.getSelection()[0].column;
        let datos = data["Wf"][row]["c"];
        console.log(datos);
        console.log(`año: ${datos[0]["v"]} columna: ${datos[col]["v"]}`);
    }

    google.visualization.events.addListener(chart, 'select', selectHandler);

    chart.draw(data, google.charts.Bar.convertOptions(options));

    var btns = document.getElementById('btn-group');

    btns.onclick = function(e) {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.id != "diseño") {
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

    chart.draw(data, google.charts.Bar.convertOptions(options));

    var btns = document.getElementById('btn-group_MasVentas');

    btns.onclick = function(e) {
        if (e.target.tagName === 'BUTTON') {
            options.vAxis.format = e.target.id === 'none' ? '' : e.target.id;
            chart.draw(data, google.charts.Bar.convertOptions(options));
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

    chart.draw(data, google.charts.Bar.convertOptions(options));

    var btns = document.getElementById('btn-group_MenosVentas');

    btns.onclick = function(e) {
        if (e.target.tagName === 'BUTTON') {
            options.vAxis.format = e.target.id === 'none' ? '' : e.target.id;
            chart.draw(data, google.charts.Bar.convertOptions(options));
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