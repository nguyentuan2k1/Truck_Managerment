var mymap = L.map('mapid').setView([16.0669077, 108.2137987], 6);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVvdmFubWVveHgiLCJhIjoiY2tyNHRpdW53Mno0MDJ2bzhzZXU2OXZhdSJ9.z9bdsi-GlnxmToSg5njRcA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
    //  zoom:-2,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGVvdmFubWVveHgiLCJhIjoiY2tyNHRpdW53Mno0MDJ2bzhzZXU2OXZhdSJ9.z9bdsi-GlnxmToSg5njRcA'
}).addTo(mymap);






var StartIcon = L.icon({
    iconUrl: 'img/location.svg',

});
var EndIcon = L.icon({
    iconUrl: 'img/map-origin.svg',

});
var Truckicon = L.icon({
    iconUrl: 'img/truck-tracking.svg',

});
var fromToPolyline;
var polylineisChoose;



var url = "https://gps.loglag.com/v2/orders/123456789";
fetch(url)
    .then(function (data) {
        return data.json();
    })
    .then(function (data) {
        let data_root = data.data;
        var startMarker = L.marker([data_root.from_place.lat, data_root.from_place.long], { icon: StartIcon }).addTo(mymap).bindPopup(data_root.from_place.type + ":<br>" + data_root.from_place.address);
        var EndMarker = L.marker([data_root.to_place[0].lat, data_root.to_place[0].long], { icon: EndIcon }).addTo(mymap).bindPopup(data_root.to_place[0].type + ":<br>" + data_root.to_place[0].address);
        var polyline = L.polyline([[data_root.from_place.lat, data_root.from_place.long], [data_root.to_place[0].lat, data_root.to_place[0].long]], { color: '#d95525' }).addTo(mymap);
        fromToPolyline = polyline;
        mymap.fitBounds(polyline.getBounds());
        var order_infomation_data = {
            order_id: data_root.booking_code,
            Order_point_of_departure: data_root.from_place.address,
            Order_destination: data_root.to_place[0].address,
            Order_boss: data_root.owner_name,
            Order_drive: GetDriverFromRootData(data_root)
        }
        Fill_order_infomation_data(order_infomation_data);
       
        createCarFollowData(data_root.vehicles);
      
        // for(i in mymap._layers) {
        //     if(mymap._layers[i]._path != undefined) {
        //         try {
        //             mymap.removeLayer(mymap._layers[i]);
        //         }
        //         catch(e) {
        //             console.log("problem with " + e + mymap._layers[i]);
        //         }
        //     }
        // }
        // console.log(mymap);

    })
    .catch((error) => {
        alert("Error" + error);
    });







document.querySelector('.leaflet-control-container').style.display = 'none';

// Xử lý sự kiện nút hiển thị data
var display_data = true;
let btn_display_data = document.querySelector('.btn-display-data');
btn_display_data.addEventListener('click', () => {
    let icon_display_data = document.querySelector('.icon-display-data');

    if (display_data == true) {
        document.querySelector('.data-detail').style.left = '-350px';
        icon_display_data.className = 'icon-display-data fas fa-chevron-right';
        display_data = false;
    }
    else {
        document.querySelector('.data-detail').style.left = '0px';
        icon_display_data.className = 'icon-display-data fas fa-chevron-left';
        display_data = true;
    }

})
// End xử lý sự kiện hiển thị data

// Đổ dữ liệu theo hành trình bằng css 

function Filldata_Journey(array_data) {
    let parent_list_Journey = document.querySelector('.list-cover-data-Journeys');
    parent_list_Journey.innerHTML = "";
    for (let i = 0; i < array_data.length - 1; i++) {
        // Fill data to Journeys
        if (array_data[i].class == 'active') {
            parent_list_Journey.innerHTML += '<li class="list-cover-data-Journeys-item" ><span  class="number-stage col-md-1 text-center current-stage " >' + (i + 1) + '<i class="arrow-down fas fa-long-arrow-alt-down"></i> </span><span  class="Journey-text col-md-11 " >' + array_data[i].text + '</span></li>';
        }
        else {
            parent_list_Journey.innerHTML += '<li class="list-cover-data-Journeys-item" ><span  class="number-stage col-md-1 text-center  " >' + (i + 1) + '<i class="arrow-down fas fa-long-arrow-alt-down"></i> </span><span  class="Journey-text col-md-11 " >' + array_data[i].text + '</span></li>';
        }

    }
    parent_list_Journey.innerHTML += '<li class="list-cover-data-Journeys-item" ><span  class="number-stage col-md-1 text-center  " >' + array_data.length + '</span><span  class="Journey-text col-md-11 " >' + array_data[array_data.length - 1].text; + '</span></li>';






}

//Filldata_Journey(datamau, 2);

// Sự kiện chuyển giữa các tab
let all_tab = document.querySelectorAll('.cover-title');
all_tab.forEach(element => {
    element.addEventListener('click', function () {
        let title = element.querySelector('.data-title').innerHTML;

        if (title == 'Thông Tin Đơn Hàng') {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');
            // let title_active = tab_active.querySelector('.data-title').innerHTML;

            document.querySelector('.data-Journeys').style.display = 'none';
            document.querySelector('.data-driver').style.display = 'none';
            document.querySelector('.data-infomation-order').style.display = 'block';
            element.classList.add('active');



        }
        else if (title == 'Tài xế') {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');
            // let title_active = tab_active.querySelector('.data-title').innerHTML;

            document.querySelector('.data-Journeys').style.display = 'none';
            document.querySelector('.data-infomation-order').style.display = 'none';
            document.querySelector('.data-driver').style.display = 'block';
            //  Fill_dirver_data(drive_data);
            element.classList.add('active');


        }
        else if (title == 'Hành Trình') {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');
            //  let title_active = tab_active.querySelector('.data-title').innerHTML;

            document.querySelector('.data-infomation-order').style.display = 'none';
            document.querySelector('.data-driver').style.display = 'none';
            document.querySelector('.data-Journeys').style.display = 'block';
            // Filldata_Journey(datamau, 2);
            element.classList.add('active');


        }

    })
});


// Đổ dữ liệu cho Thông tin đơn hàng


// Hàm đổ dữ liệu vào
// Nếu có thay đổi json thì bên trong cũng change theo
function Fill_order_infomation_data(order_infomation_data) {
    let Order_id = document.querySelector('#Order-id');
    let Order_point_of_departure = document.querySelector('#Order-point-of-departure');
    let Order_destination = document.querySelector('#Order-destination');
    let Order_boss = document.querySelector('#Order-boss');
    let Order_drive = document.querySelector('#Order-drive');
    Order_id.innerHTML = order_infomation_data['order_id'];
    Order_point_of_departure.innerHTML = order_infomation_data['Order_point_of_departure'];
    Order_destination.innerHTML = order_infomation_data['Order_destination'];
    Order_boss.innerHTML = order_infomation_data['Order_boss'];
    Order_drive.innerHTML = order_infomation_data['Order_drive'];
}



// Hàm đổ dữ liệu cho driver
function Fill_dirver_data(driver_data) {
    let drive_name = document.querySelector('#drive-name')
    let drive_phone = document.querySelector('#drive-phone');
    let dirve_car_number = document.querySelector('#dirve-car-number');
    drive_name.innerHTML = driver_data['drive_name'];
    drive_phone.innerHTML = driver_data['drive_phone'];
    dirve_car_number.innerHTML = driver_data['dirve_car_number'];
}

// Lấy dữ liệu người lái xe từ dữ liệu gốc
function GetDriverFromRootData(Rootdata) {
    let array_driver = Rootdata.vehicles;
    let driver_name = "";
    array_driver.forEach((element, i) => {
        if ((i + 1) == array_driver.length) {
            driver_name += element.driver;
        }
        else {
            driver_name += element.driver + ",";
        }
    })

    return driver_name;
}

// Test 



// tạo xe theo dữ liệu
function createCarFollowData(array_vehicles) {


    array_vehicles.forEach((element, i) => {
        // gán vị trí tài xế


        let array_position = [];
        element.positions.forEach((obj_position) => {
            array_position.push(Object.values(obj_position));
        })
        let marker = L.marker([element.positions[0].latitude, element.positions[0].longitude], { icon: Truckicon, driver: { name: element.driver, number_plate: element.number_plate } })
            .addTo(mymap)
            .bindPopup("Vị trí xe hiện tại:<br>Họ và tên:" + element.driver + "<br> Số xe:" + element.number_plate + "");
        let polyline = L.polyline(array_position, { color: 'transparent' }).addTo(mymap);
        marker.addEventListener('preclick',()=>{
            if(polylineisChoose !=undefined)
            {
                polylineisChoose.setStyle({
                    color: 'transparent'
                });

                fromToPolyline.setStyle({
                    color: 'transparent'
                });

            }
           
        })


        marker.addEventListener(('click'), () => {
            let driver_data = {
                drive_name: array_vehicles[i].driver,
                drive_phone: array_vehicles[i].phone_number,
                dirve_car_number: array_vehicles[i].number_plate
            };
            Fill_dirver_data(driver_data);
            let array_journey_data = element.status;
            Filldata_Journey(array_journey_data);
           if(mymap.getZoom()<=12)
           {
            mymap.flyToBounds(polyline.getBounds(), { 'duration': 1.6 });
            setTimeout(()=>{
                polyline.setStyle({
                    color: '#d95525'
                });
                fromToPolyline.setStyle({
                  color: '#d95525'
              });
            },1600);
           }
           else if(mymap.getZoom()>12 && mymap.getZoom()<=15)
           {
            mymap.flyToBounds(polyline.getBounds(), { 'duration': 0.7 });
            setTimeout(()=>{
                polyline.setStyle({
                    color: '#d95525'
                });
                fromToPolyline.setStyle({
                  color: '#d95525'
              });
            },1000);
           }
           else if(mymap.getZoom()>=16)
           {
            mymap.flyToBounds(polyline.getBounds(), { 'duration': 0.4 });
            setTimeout(()=>{
              polyline.setStyle({
                  color: '#d95525'
              });
              fromToPolyline.setStyle({
                color: '#d95525'
            });
            },700);
           }
           polylineisChoose = polyline;
          
            
        })



    })
}