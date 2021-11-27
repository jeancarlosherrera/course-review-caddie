mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: courseToMap.geometry.coordinates,
    zoom: 9
});

new mapboxgl.Marker()
    .setLngLat(courseToMap.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3> ${courseToMap.name}</h3>`
            )
    )
    .addTo(map);


