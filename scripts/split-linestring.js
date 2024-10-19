import { lineString, length, along } from '@turf/turf'
import fs from 'fs'

const blockA = [
    {
        start: [123.89665561184698, 10.29545915060376],
        end: [123.89791893229744, 10.29600278893757],
    },
    {
        start: [123.89791893229744, 10.29600278893757],
        end: [123.8980329261816, 10.295902506210316],
    },
    {
        start: [123.8980329261816, 10.295902506210316],
        end: [123.89774420304177, 10.29498398365206],
    },
    {
        start: [123.89774420304177, 10.29498398365206],
        end: [123.89665561184698, 10.29545915060376],
    },
]

const blockB = [
    {
        start: [123.89654941684468, 10.295559140009777],
        end: [123.89791197903206, 10.296130487852418],
    },
    {
        start: [123.89791197903206, 10.296130487852418],
        end: [123.89813326127289, 10.296274314287167],
    },
    {
        start: [123.89813326127289, 10.296274314287167],
        end: [123.89749016224854, 10.297568206596972],
    },
    {
        start: [123.89749016224854, 10.297568206596972],
        end: [123.89739367820847, 10.297666652439753],
    },
    {
        start: [123.89739367820847, 10.297666652439753],
        end: [123.89608667777658, 10.297260973969658],
    },
    {
        start: [123.89608667777658, 10.297260973969658],
        end: [123.89654941684468, 10.295559140009777],
    },
]

const blockC = [
    {
        start: [123.89630183227885, 10.295647822976866],
        end: [123.89593019004944, 10.297149831053565],
    },
    {
        start: [123.89593019004944, 10.297149831053565],
        end: [123.89484671001047, 10.296846054718051],
    },
    {
        start: [123.89484671001047, 10.296846054718051],
        end: [123.89500966083428, 10.296215999163497],
    },
    {
        start: [123.89500966083428, 10.296215999163497],
        end: [123.89630183227885, 10.295647822976866],
    },
]

const blockD = [
    {
        start: [123.89624075313918, 10.295450530569108],
        end: [123.89507361211074, 10.29600215398873],
    },
    {
        start: [123.89507361211074, 10.29600215398873],
        end: [123.89515118643891, 10.29570379175576],
    },
    {
        start: [123.89515118643891, 10.29570379175576],
        end: [123.89537333110597, 10.295065434402458],
    },
    {
        start: [123.89537333110597, 10.295065434402458],
        end: [123.89624075313918, 10.295450530569108],
    },
]

const blockE = [
    {
        start: [123.89645646338062, 10.29525554564465],
        end: [123.89546536117835, 10.294854343318338],
    },
    {
        start: [123.89546536117835, 10.294854343318338],
        end: [123.89544609535396, 10.294057733849186],
    },
    {
        start: [123.89544609535396, 10.294057733849186],
        end: [123.89663958848469, 10.294540931040169],
    },
    {
        start: [123.89663958848469, 10.294540931040169],
        end: [123.89645646338062, 10.29525554564465],
    },
]

const blockF = [
    {
        start: [123.8972284261841, 10.295071524208028],
        end: [123.89672627112843, 10.295287049977567],
    },
    {
        start: [123.89672627112843, 10.295287049977567],
        end: [123.89711926205891, 10.293555450690967],
    },
    {
        start: [123.89711926205891, 10.293555450690967],
        end: [123.89721283809257, 10.293511807456348],
    },
    {
        start: [123.89721283809257, 10.293511807456348],
        end: [123.89778817192771, 10.293675427868251],
    },
    {
        start: [123.89778817192771, 10.293675427868251],
        end: [123.8980175008004, 10.293840367714525],
    },
    {
        start: [123.8980175008004, 10.293840367714525],
        end: [123.89775548025271, 10.294860402004595],
    },
    {
        start: [123.89775548025271, 10.294860402004595],
        end: [123.89732900901863, 10.29500818756072],
    },
]

const coordinates = [
    ...blockA,
    ...blockB,
    ...blockC,
    ...blockD,
    ...blockE,
    ...blockF,
]

const splitLineStringIntoEqualPartsByLength = (coordinates, segmentLength) => {
    const newFeatures = []

    coordinates.forEach(({ start, end }) => {
        const lineStringFeature = lineString([start, end])
        const totalLength = length(lineStringFeature, { units: 'kilometers' })

        let currentDistance = 0

        // Create segments of fixed length until the total length is reached
        while (currentDistance < totalLength) {
            const startPoint = along(lineStringFeature, currentDistance, {
                units: 'kilometers',
            })
            let endPointDistance = currentDistance + segmentLength

            // Ensure the last segment ends at the final point if it exceeds total length
            if (endPointDistance > totalLength) {
                endPointDistance = totalLength
            }

            const endPoint = along(lineStringFeature, endPointDistance, {
                units: 'kilometers',
            })

            const segment = {
                type: 'Feature',
                properties: {
                    weight: null,
                },
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        startPoint.geometry.coordinates,
                        endPoint.geometry.coordinates,
                    ],
                },
            }

            newFeatures.push(segment)
            currentDistance = endPointDistance
        }
    })

    return {
        type: 'FeatureCollection',
        features: newFeatures,
    }
}

// The fixed length for each segment in kilometers
const segmentLength = 0.0075

const splitGeoJSON = splitLineStringIntoEqualPartsByLength(
    coordinates,
    segmentLength
)

// Write the result to a JSON file
fs.writeFileSync(
    'data/geojson/colon.json',
    JSON.stringify(splitGeoJSON, null, 2),
    'utf8'
)

console.log('GeoJSON has been written to colon.json')
