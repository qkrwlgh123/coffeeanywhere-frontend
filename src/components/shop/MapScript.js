const { kakao } = window;

export default function MapScript({ latitude, longitude, name }) {
  const container = document.getElementById('myMap');
  const options = {
    center: new kakao.maps.LatLng(latitude, longitude),
    level: 1,
  };
  const map = new kakao.maps.Map(container, options);
  const marker = new kakao.maps.Marker({
    map: map,
    position: new kakao.maps.LatLng(latitude, longitude),
  });
  const infowindow = new kakao.maps.InfoWindow({
    content: `<div style="width:150px; text-align:center; padding:6px 0;
    border-radius:555px;">${name}</div>`,
  });
  infowindow.open(map, marker);
}
