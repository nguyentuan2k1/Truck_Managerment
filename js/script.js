
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
    iconSize: [50, 50],


});
var fromToPolyline;
var polylineisChoose;


var array_vehicels_id = [];

var url = "https://gps.loglag.com/v2/orders/123456789";
fetch(url)
    .then(function (data) {
        return data.json();
    })
    .then(function (data) {
        let data_root = data.data;

        L.Routing.control({
            waypoints: [
                start = L.latLng(data_root.from_place.lat, data_root.from_place.long),
                end = L.latLng(data_root.to_place[0].lat, data_root.to_place[0].long)
            ],
            createMarker: function (i, wp, nWps) {
                if (i === 0 || i === nWps - 1) {
                    if (wp.latLng == start) {
                        return L.marker(wp.latLng, {
                            icon: StartIcon
                        }).bindPopup(data_root.from_place.type + ":<br>" + data_root.from_place.address);
                    }
                    else {
                        return L.marker(wp.latLng, {
                            icon: EndIcon
                        }).bindPopup(data_root.to_place[0].type + ":<br>" + data_root.to_place[0].address);
                    }
                }
            }
        }).addTo(mymap);

        //   mymap.fitBounds(polyline.getBounds());
        var order_infomation_data = {
            order_id: data_root.booking_code,
            Order_point_of_departure: data_root.from_place.address,
            Order_destination: data_root.to_place[0].address,
            Order_boss: data_root.owner_name,
            Order_drive: GetDriverFromRootData(data_root)
        }
        Fill_order_infomation_data(order_infomation_data);

        createCarFollowData(data_root.vehicles);





    })
    .catch((error) => {
        alert("Error" + error);
    });

setInterval(() => {
 
    fetch(url)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {

            let data_root = data.data;
            document.querySelector('#Order-drive').innerHTML = GetDriverFromRootData(data_root);
            UpdateData(data_root);

        })
        .catch((error) => {
            alert("Error" + error);
        });


}, 5000);







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


// Sự kiện chuyển giữa các tab
let all_tab = document.querySelectorAll('.cover-title');
all_tab.forEach(element => {
    element.addEventListener('click', function () {
        let title = element.querySelector('.data-title').innerHTML;

        if (title == 'Thông Tin Đơn Hàng') {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');
            document.querySelector('.data-Journeys').style.display = 'none';
            document.querySelector('.data-driver').style.display = 'none';
            document.querySelector('.data-infomation-order').style.display = 'block';
            element.classList.add('active');



        }
        else if (title == 'Tài xế') {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');

            document.querySelector('.data-Journeys').style.display = 'none';
            document.querySelector('.data-infomation-order').style.display = 'none';
            document.querySelector('.data-driver').style.display = 'block';
            element.classList.add('active');


        }
        else if (title == 'Hành Trình') {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');

            document.querySelector('.data-infomation-order').style.display = 'none';
            document.querySelector('.data-driver').style.display = 'none';
            document.querySelector('.data-Journeys').style.display = 'block';
            element.classList.add('active');


        }

    })
});


// Đổ dữ liệu cho Thông tin đơn hàng


// Hàm đổ dữ liệu vào
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





// tạo xe theo dữ liệu
function createCarFollowData(array_vehicles) {

    array_vehicles.forEach((element, i) => {
        // gán vị trí tài xế
        let array_position = [];
        element.positions.forEach((obj_position) => {
            array_position.push(Object.values(obj_position));
        })
        array_vehicels_id.push(element.vehicle_id);
        let marker = L.marker([element.positions[0].latitude, element.positions[0].longitude], { icon: Truckicon, vehicle_id: element.vehicle_id })
            .addTo(mymap)
            .bindPopup("Vị trí xe hiện tại:<br>Họ và tên:" + element.driver + "<br> Số xe:" + element.number_plate + "");
        let polyline = L.polyline(array_position, { color: 'transparent', vehicle_id: element.vehicle_id }).addTo(mymap);
        marker.addEventListener('preclick', () => {
            if (polylineisChoose != undefined) {
                polylineisChoose.setStyle({
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
            if (mymap.getZoom() <= 12) {
                mymap.flyToBounds(polyline.getBounds(), { 'duration': 1.6 });
                setTimeout(() => {
                    polyline.setStyle({
                        color: '#d95525'
                    });

                }, 1600);
            }
            else if (mymap.getZoom() > 12 && mymap.getZoom() <= 15) {
                mymap.flyToBounds(polyline.getBounds(), { 'duration': 0.7 });
                setTimeout(() => {
                    polyline.setStyle({
                        color: '#d95525'
                    });

                }, 1000);
            }
            else if (mymap.getZoom() >= 16) {
                mymap.flyToBounds(polyline.getBounds(), { 'duration': 0.4 });
                setTimeout(() => {
                    polyline.setStyle({
                        color: '#d95525'
                    });
                    fromToPolyline.setStyle({
                        color: '#d95525'
                    });
                }, 700);
            }
            polylineisChoose = polyline;


        })



    })

}
function Quayxe(lat1, lon1, lat2, lon2) {
    var p1 = {
        x: lat1,
        y: lon1
    };

    var p2 = {
        x: lat2,
        y: lon2
    };
    // angle in radians
    var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    // angle in degrees
    var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

    return angleDeg;
}

function UpdateData(data_root) {
    if (data_root.vehicles.length != array_vehicels_id.length) {
        if (data_root.vehicles.length > array_vehicels_id.length) {
            // tao xe
            let array_different_vehicals = [];
            data_root.vehicles.forEach((element) => {
                if (!array_vehicels_id.includes(element.vehicle_id)) {
                    array_different_vehicals.push(element);
                }
            });
            // tao xe theo mang khac biet(nhung xe khong co truoc do)
            createCarFollowData(array_different_vehicals);
        }
        else {
            // xoa xe
            // co du lieu goc -> lay id cac xe tu du lieu goc ra 
            // sau do di so sanh vs du lieu da quan ly truoc do
            let array_different_vehicals = [];
            let array_root_data_id_vehicals = [];
            data_root.vehicles.forEach((element) => {
                array_root_data_id_vehicals.push(element.vehicle_id);
            });
            array_vehicels_id.forEach((element, index) => {
                if (!array_root_data_id_vehicals.includes(element)) {
                    array_different_vehicals.push(element);
                    array_vehicels_id.splice(index, 1); //  xoa element
                }
            })
            array_different_vehicals.forEach((element) => {
                for (i in mymap._layers) {
                    // xoa vat the tren man hinh di
                    if (mymap._layers[i].options.vehicle_id == element) {
                        mymap.removeLayer(mymap._layers[i]);
                    }
                }
            })



        }
    }
    let array_update_vehical = data_root.vehicles;

    for (i in mymap._layers) {
      

        if (mymap._layers[i].options.vehicle_id != undefined) {
            array_update_vehical.forEach((element,index) => {
                if (element.vehicle_id == mymap._layers[i].options.vehicle_id) {
                    // cập nhật vị trí xe 
                    if (mymap._layers[i].options.icon != undefined && mymap._layers[i].options.vehicle_id == element.vehicle_id) {
                        // get old position of that car
                        let oldPositonOfCar = Object.values(mymap._layers[i]._latlng);
                        // get deg
                        let deg = Quayxe(oldPositonOfCar[0], oldPositonOfCar[1], element.positions[element.positions.length - 1].latitude, element.positions[element.positions.length - 1].longitude);
                         // assign deg for rotate
                        mymap._layers[i].options.rotationAngle = ''+deg
                        mymap._layers[i].addEventListener('click',(element)=>{
                            let array_journey_data = element.status;
                            Filldata_Journey(array_journey_data);
                        })
                    }
                    // cập nhật đường path
                    if(mymap._layers[i]._path != undefined && mymap._layers[i].options.vehicle_id == element.vehicle_id) {
                     let allDataPos = [];
                    //  let LastPos = Object.values(mymap._layers[i]._latlngs[mymap._layers[i]._latlngs.length-1]);
                    //     allDataPos.push(LastPos);
                     let dataPosGeted = array_update_vehical[index].positions;
                        dataPosGeted.forEach((element)=>{
                            allDataPos.push(Object.values(element));
                        });
                        // có dữ liệu rồi h vẽ getLatLngs()	
                        mymap._layers[i].addLatLng( mymap._layers[i].getLatLngs(),allDataPos);
                    }

                   
                }
            })
        }


    }

}