$(document).ready(function () {
    $('#example').DataTable({
        "scrollY": "50vh",
        "scrollCollapse": true,
        "paging": true,
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'print',
            {
                extend: 'collection',
                text: 'Export as',
                buttons: ['excelHtml5',
                    'csvHtml5',
                    'pdfHtml5',]
            },
            'colvis'
        ],
    });
    const t = $('#example').DataTable();
    firebase.firestore().collection("blacklist").get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            let data = doc.data();
            t.row.add([
                data.name,
                data.email,
                data.reason
            ]).draw(false);
        }, error => {
            console.log(error.message);
        });
    });
});




