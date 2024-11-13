// Initialize the Cesium Viewer
const viewer = new Cesium.Viewer("cesiumContainer", {
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: "https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles" 
    }),
    shouldAnimate: true
});

// Coordinates 
const delhi = Cesium.Cartesian3.fromDegrees(77.1000, 28.5561, 1000);
const bengaluru = Cesium.Cartesian3.fromDegrees(77.7069, 13.1989, 1000);

// Flight Path
viewer.entities.add({
    polyline: {
        positions: [delhi, bengaluru],
        width: 5,
        material: Cesium.Color.RED
    }
});

// Departure and Destination Points with Highlighting
const departurePoint = viewer.entities.add({
    position: delhi,
    point: {
        pixelSize: 10,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
    }
});

const destinationPoint = viewer.entities.add({
    position: bengaluru,
    point: {
        pixelSize: 10,
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2
    }
});

// Pulsing Effect (simple approach)
let pulseSize = 10;
viewer.clock.onTick.addEventListener(() => {
    pulseSize = pulseSize >= 15 ? 10 : pulseSize + 0.1;
    departurePoint.point.pixelSize = pulseSize;
    destinationPoint.point.pixelSize = pulseSize;
});

//Airplane Animation
const airplanePosition = new Cesium.SampledPositionProperty();
airplanePosition.addSample(Cesium.JulianDate.now(), delhi);
airplanePosition.addSample(Cesium.JulianDate.addSeconds(Cesium.JulianDate.now(), 10, new Cesium.JulianDate()), bengaluru);

const airplane = viewer.entities.add({
    position: airplanePosition,
    model: {
        uri: "Specs\Data\Models\glTF-2.0\TwoSidedPlane\glTF\TwoSidedPlane.gltf", 
        scale: 0.1
    },
    orientation: new Cesium.CallbackProperty(() => {
        return Cesium.Transforms.headingPitchRollQuaternion(
            airplanePosition.getValue(viewer.clock.currentTime),
            new Cesium.HeadingPitchRoll(0, 0, 0)
        );
    }, false)
});


// Add Random Weather Effects (Clouds)
for (let i = 0; i < 10; i++) {
    const cloudPosition = Cesium.Cartesian3.fromDegrees(
        77.2090 + Math.random() * 0.5 - 0.25,
        20 + Math.random() * 10 - 5,
        3000 + Math.random() * 500
    );

    viewer.entities.add({
        position: cloudPosition,
        point: {
            pixelSize: 10,
            color: Cesium.Color.WHITE.withAlpha(0.5)
        }
    });
}
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(77.2090, 28.6139, 1000), 
});