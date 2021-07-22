 var mymap = L.map('mapid').setView([16.0669077,108.2137987],6);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGVvdmFubWVveHgiLCJhIjoiY2tyNHRpdW53Mno0MDJ2bzhzZXU2OXZhdSJ9.z9bdsi-GlnxmToSg5njRcA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
   // maxZoom: 18,
  //  zoom:-2,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoidGVvdmFubWVveHgiLCJhIjoiY2tyNHRpdW53Mno0MDJ2bzhzZXU2OXZhdSJ9.z9bdsi-GlnxmToSg5njRcA'
}).addTo(mymap);



var latlong =[[20.9373413,106.3145542],[10.8694261,106.728362],[10.811112832744,106.66910482636]];

var polyline = L.polyline(latlong, {color: 'red'}).addTo(mymap);
mymap.fitBounds(polyline.getBounds());

var StartIcon = L.icon({
    iconUrl: 'img/location.svg',
    
});
var EndIcon = L.icon({
    iconUrl: 'img/map-origin.svg',
    
});
var Truckicon = L.icon({
    iconUrl: 'img/truck-tracking.svg',
    
});

var url = "https://gps.loglag.com/v2/orders/123456789";
function fecthdata(url)
{
    fetch(url)
    .then(function(data){
       return data.json();
    })
    .then(function(data){
       console.log(data);
     })
}
fecthdata();


var startMarker = L.marker([20.9373413,106.3145542], {icon: StartIcon}).addTo(mymap).bindPopup("Điểm bắt đầu:<br>Hải Dương, Hai Duong, Vietnam");
var EndMarker = L.marker([10.8694261,106.728362], {icon: EndIcon}).addTo(mymap).bindPopup("Điểm kết thúc:<br>Chợ đầu mối nông sản Thủ Đức, Quốc lộ 1A, Tam Bình, Thủ Đức, Ho Chi Minh City, Vietnam");
var TruckMarker = L.marker([10.811112832744,106.66910482636], {icon: Truckicon}).addTo(mymap).bindPopup("Vị trí xe hiện tại:<br>Họ và tên: Nguyễn Văn A <br> Số xe: 49-H5 123456");


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
// dữ liệu mẫu 
let data_ex_Journey = ['Chờ thực hiện', 'Bắt đầu', 'Đến cảng nhận hàng', 'Nhận hàng xong và đến kho giao hàng', 'Đã đến kho chờ dỡ hàng xuống','Dỡ hàng xong rời kho về cảng/depot trả rỗng','Trả rỗng ','Hoàn Thành'];
let current_stage = 2;
// Hàm đổ dữ liệu vào tab Hành trình / Nếu current_stage nhỏ hơn 0 thì đổi thuật toán dòng 43 thành (i!=current_stage)
function Filldata_Journey(array_data, current_stage) {
    let parent_list_Journey = document.querySelector('.list-cover-data-Journeys');
    parent_list_Journey.innerHTML = "";
    for (let i = 0; i < array_data.length - 1 ; i++) {
        // Fill data to Journeys
        // khúc này có thể thay đổi tí vì sau này nếu current stage < 0 thì thay đổi nếu lớn hơn 0 thì ko change   
        if((i+1)!=current_stage )
        {
            parent_list_Journey.innerHTML += '<li class="list-cover-data-Journeys-item" ><span  class="number-stage col-md-1 text-center " >' + (i + 1) + '<i class="arrow-down fas fa-long-arrow-alt-down"></i> </span><span  class="Journey-text col-md-11 " >' + array_data[i] + '</span></li>';
        }   
        else{
            parent_list_Journey.innerHTML += '<li class="list-cover-data-Journeys-item" ><span  class="number-stage col-md-1 text-center current-stage " >' + (i + 1) + '<i class="arrow-down fas fa-long-arrow-alt-down"></i> </span><span  class="Journey-text col-md-11 " >' + array_data[i] + '</span></li>';
        }    
      
    }
   
    parent_list_Journey.innerHTML += '<li class="list-cover-data-Journeys-item" ><span  class="number-stage col-md-1 text-center  " >' +array_data.length + '</span><span  class="Journey-text col-md-11 " >' + array_data[array_data.length-1]; + '</span></li>';

    

}
Filldata_Journey(data_ex_Journey, current_stage); // current-stage là số lớn hơn 0 nha
document.querySelector('.data-Journeys')


// Sự kiện chuyển giữa các tab
let all_tab = document.querySelectorAll('.cover-title');
all_tab.forEach(element => {
    element.addEventListener('click',function(){
        let title = element.querySelector('.data-title').innerHTML;
      
        if(title == 'Thông Tin Đơn Hàng')
        {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');
           // let title_active = tab_active.querySelector('.data-title').innerHTML;
           
                document.querySelector('.data-Journeys').style.display = 'none';
                document.querySelector('.data-driver').style.display = 'none';
                document.querySelector('.data-infomation-order').style.display= 'block';
                element.classList.add('active');
                
            
        }
        else if(title == 'Tài xế'){
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');
           // let title_active = tab_active.querySelector('.data-title').innerHTML;
             
                document.querySelector('.data-Journeys').style.display = 'none';
                document.querySelector('.data-infomation-order').style.display = 'none';
                document.querySelector('.data-driver').style.display= 'block';
                element.classList.add('active');
              
           
        }
        else if(title == 'Hành Trình')
        {
            let tab_active = document.querySelector('.active');
            tab_active.classList.remove('active');
          //  let title_active = tab_active.querySelector('.data-title').innerHTML;
             
                document.querySelector('.data-infomation-order').style.display = 'none';
                document.querySelector('.data-driver').style.display = 'none';
                document.querySelector('.data-Journeys').style.display= 'block';
                Filldata_Journey(data_ex_Journey,current_stage);
                element.classList.add('active');
                
            
        }
       
    })
});


// Đổ dữ liệu cho Thông tin đơn hàng

// data tạm để test = json
let order_infomation_data = {
    order_id : 'BTC-1234567',
    Order_point_of_departure : 'Miền Bắc',
    Order_destination : 'Cảng Sài Gòn',
    Order_boss : 'Kelvin',
    Order_drive : 'Nguyễn Văn A',
};
// Hàm đổ dữ liệu vào
// Nếu có thay đổi json thì bên trong cũng change theo
function Fill_order_infomation_data(order_infomation_data){
    let Order_id = document.querySelector('#Order-id');
    let Order_point_of_departure = document.querySelector('#Order-point-of-departure');
    let Order_destination = document.querySelector('#Order-destination');
    let Order_boss = document.querySelector('#Order-boss');
    let Order_drive = document.querySelector('#Order-drive');
    Order_id.innerHTML = order_infomation_data['order_id'];
    Order_point_of_departure.innerHTML =  order_infomation_data['Order_point_of_departure'];
    Order_destination.innerHTML =  order_infomation_data['Order_destination'];
    Order_boss.innerHTML =  order_infomation_data['Order_boss'];
    Order_drive.innerHTML = order_infomation_data['Order_drive'];
}
Fill_order_infomation_data(order_infomation_data);

// Dữ liệu mẫu Driver
let drive_data = {
    drive_name : 'Nguyễn Văn C',
    drive_phone : '090909909',
    dirve_car_number : '12C1 3456',
  
};
// Hàm đổ dữ liệu cho driver
function Fill_dirver_data(driver_data){
   let drive_name = document.querySelector('#drive-name')
   let drive_phone = document.querySelector('#drive-phone');
   let dirve_car_number = document.querySelector('#dirve-car-number');
   drive_name.innerHTML = driver_data['drive_name'];
   drive_phone.innerHTML = driver_data['drive_phone'];
   dirve_car_number.innerHTML = driver_data['dirve_car_number'];
}
Fill_dirver_data(drive_data);
