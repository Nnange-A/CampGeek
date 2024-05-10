
mapboxgl.accessToken = mapBoxToken;

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl()/* , "bottom-left" */);

// Set marker options.
const marker = new mapboxgl.Marker({
    color: "#3355AA",
    draggable: true
})
	.setLngLat(campground.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 })
			.setHTML(
				`<h5>${campground.title}</h5><p>${campground.location}</p>`
			)
	)
	.addTo(map);