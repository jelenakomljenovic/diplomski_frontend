"use client"
import * as React from 'react';
import {SyntheticEvent, useEffect, useState} from 'react';
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {getAllFaculties} from "../api/faculty/facultyApi";
import useStyles from './../styles';
import {GoogleMap, InfoWindowF, MarkerClustererF, MarkerF, useJsApiLoader} from "@react-google-maps/api";
import mapStyles from '../styles/mapStyles';
import {AutocompleteComponent} from "./AutocompleteComponent";
import {AutocompleteValue} from "@mui/material";
import ReactImageLightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {Link} from 'react-router-dom';
import "./map.css";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {getAllImagesByUniversityId} from "../api/image/imageApi";


const mapContainerStyle = {
    width: "100vw",
    height: "83vh",
    top: "2%",
};


const options = {
    styles: mapStyles,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
}


function Map() {
    const [faculties, setFaculties] = useState<Array<CreateFacultyRequest>>([]);
    const [selectedFaculty, setSelectedFaculty] = useState<CreateFacultyRequest | null>(null);
    const classes = useStyles();
    const [zoom, setZoom] = useState(14);
    const [position, setPosition] = useState({lat: 44.772182, lng: 17.191000});
    const mapRef = React.useRef();
    const [imagesArray, setImagesArray] = useState<Array<string>>([]);


    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const lightboxStyles = {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10000,
    };

    useEffect(() => {
        if (selectedFaculty) {
            const fetchImages = async () => {
                const imagesRes = await getAllImagesByUniversityId(selectedFaculty.id);
                const base64Images = imagesRes.data.gallery.map((image: any) => image.pictureBase64);
                setImagesArray(base64Images);
            };
            fetchImages();
        }
    }, [selectedFaculty]);

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [selectedFaculty]);

    const showNextImage = () => {
        if (selectedFaculty && imagesArray.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesArray.length);
        }
    };

    const showPreviousImage = () => {
        if (selectedFaculty && imagesArray.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesArray.length) % imagesArray.length);
        }
    };

    const onMapLoad = React.useCallback((map: any) => {
        mapRef.current = map;
    }, []);

    const handleChangeAutocomplete = (event: SyntheticEvent, value: AutocompleteValue<any, any, any, any>) => {
        if (value != null) {
            setPosition({
                lat: Number.parseFloat(value.coordinates.split(',')[0]),
                lng: Number.parseFloat(value.coordinates.split(',')[1])
            });
            setZoom(21);
            setSelectedFaculty(value);
        } else {
            setCoordinates();
            setZoom(14);
        }
    }


    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: "AIzaSyBx_S40CthbKWysq6WtSsMOF7-cg8ld9v4"
    });

    const setCoordinates = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    }

    useEffect(() => {
        setCoordinates();
    }, []);

    useEffect(() => {
        const getFaculties = async () => {
            const facultiesRes = await getAllFaculties();
            setFaculties(facultiesRes.data);
        }
        getFaculties();
    }, [])


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            width: "100%",
            height: "45vh",
            position: "relative"
        }}>
            {isLoaded ? <GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={position} options={options}
                                   onLoad={onMapLoad}
                >
                    <MarkerClustererF>
                        {(cluster) => (
                            <>
                                {faculties.map((marker) => (
                                    <MarkerF
                                        key={marker.id}
                                        position={{
                                            lat: Number.parseFloat(marker.coordinates.split(',')[0]),
                                            lng: Number.parseFloat(marker.coordinates.split(',')[1]),
                                        }}
                                        clusterer={cluster}
                                        icon={{
                                            url: '/universityI.png',
                                            origin: new window.google.maps.Point(0, 0),
                                            anchor: new window.google.maps.Point(15, 15),
                                            scaledSize: new window.google.maps.Size(48, 48),
                                        }}
                                        onClick={() => setSelectedFaculty(marker)}
                                    />
                                ))}
                            </>
                        )}
                    </MarkerClustererF>

                    {selectedFaculty ? (<InfoWindowF position={{
                        lat: Number.parseFloat(selectedFaculty.coordinates.split(',')[0]),
                        lng: Number.parseFloat(selectedFaculty.coordinates.split(',')[1])
                    }} onCloseClick={() => setSelectedFaculty(null)}>
                        <div style={{minWidth: "130px"}}>
                            <Link to={`/details/${selectedFaculty.id}`} style={{
                                textDecoration: 'none',
                                color: "rgba(55,79,121,0.88)",
                                display: "block",
                                marginTop: "0px"
                            }}>
                                <h4 style={{
                                    margin: "0",
                                    paddingTop: "0px",
                                    textAlign: "center"
                                }}>{selectedFaculty.name}</h4>
                            </Link>
                            <div style={{
                                position: "relative",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <IoIosArrowBack style={{width: 22, height: 22, color: "darkgrey", cursor: "pointer"}}
                                                onClick={showPreviousImage}/>
                                <img
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        marginTop: "10px",
                                        cursor: "pointer",
                                        marginLeft: 5,
                                        marginRight: 5,
                                        WebkitUserSelect: "none"
                                    }}
                                    src={imagesArray[currentImageIndex]}
                                    alt=""
                                    onClick={() => setIsOpen(true)}
                                />
                                <IoIosArrowForward style={{width: 22, height: 22, color: "darkgrey", cursor: "pointer"}}
                                                   onClick={showNextImage}/>
                            </div>
                        </div>
                    </InfoWindowF>) : null}
                    {isOpen && (
                        <ReactImageLightbox
                            mainSrc={imagesArray[currentImageIndex]}
                            nextSrc={imagesArray[(currentImageIndex + 1) % imagesArray.length]}
                            prevSrc={imagesArray[(currentImageIndex + imagesArray.length - 1) % imagesArray.length]}
                            onCloseRequest={() => setIsOpen(false)}
                            onMovePrevRequest={() =>
                                setCurrentImageIndex((currentImageIndex + imagesArray.length - 1) % imagesArray.length)
                            }
                            onMoveNextRequest={() =>
                                setCurrentImageIndex((currentImageIndex + 1) % imagesArray.length)
                            }
                            reactModalStyle={{overlay: {...lightboxStyles}}}
                        />
                    )}

                </GoogleMap>
                : null
            }
            <div style={{
                position: "absolute",
                top: 18,
                right: 75,
                width: 322,
                height: "20%",
                zIndex: 100
            }}>
                <AutocompleteComponent label={"Pogledaj sve"} options={faculties} property={"name"} style={{
                    width: 322,
                    backgroundColor: "white"
                }} handleChange={handleChangeAutocomplete}/>
            </div>
        </div>
    );

}

export default Map;
