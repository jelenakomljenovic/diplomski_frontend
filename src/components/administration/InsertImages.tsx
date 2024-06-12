import React, {useEffect, useState} from 'react';
import {makeStyles} from '@mui/styles';
import {Box, Divider, Grid, IconButton, Pagination, Snackbar, Typography} from '@mui/material';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {deleteImage, getAllImagesByUniversityId, saveImage} from "../../api/image/imageApi";
import {Image} from "../../api/image/imageType";
import {useParams} from "react-router-dom";
import AlertDialog from "../dialogs/AlertDialog";
import {useSnackbarHelper} from "../../util/toastUtil";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: "20px",
    },
    upload: {
        position: "relative",
        width: 'calc(100% - 20px)',
        height: '200px',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "3px dashed rgba(54,150,171,0.68)",
        backgroundColor: "rgba(246,246,246,0.7)",
        margin: '10px',
        borderRadius: '8px',
        "&:hover": {
            cursor: "pointer",
        },
    },
    addPhoto: {
        fontSize: 40,
        color: "rgba(54,150,171,0.68)",
    },
    uploadContent: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
    },
    imageItem: {
        position: "relative",
        width: 'calc(100% - 20px)',
        height: '200px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        margin: '10px',
        '& img': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        },
        '& .overlay': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'none',
            justifyContent: 'center',
            alignItems: 'center',
        },
        '&:hover .overlay': {
            display: 'flex',
        },
    },
    icon: {
        color: 'white',
    },
    gridContainer: {
        boxSizing: 'border-box',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '10px',
        paddingLeft: '10px',
    },
    ul: {
        '& .MuiPaginationItem-root': {
            '&.Mui-selected': {
                background: '#4a828c',
                color: 'white',
            },
        },
    },
}));

type GalleryProps = {
    galleryProp?: Image[];
    handleGalleryChange?: (gallery: Image[]) => void;
};

function Gallery({
                     galleryProp,
                     handleGalleryChange,
                 }: GalleryProps) {

    let {id} = useParams();
    let numId = 0;
    const classes = useStyles();
    const [images, setImages] = useState<Image[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const handleClickVariant = useSnackbarHelper();
    const imagesPerPage = 7;
    const pageCount = Math.ceil(images.length / imagesPerPage);
    const indexOfLastImage = page * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
    const [imageIdToDelete, setImageIdToDelete] = useState<number>();
    const [failedUpload, setFailedUpload] = useState<boolean>(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }

        async function fetchPictures() {
            const response = await getAllImagesByUniversityId(numId);
            setImages(response.data.gallery);
        }

        if (!galleryProp) {
            fetchPictures();
        } else {
            setImages(galleryProp);
        }
    }, [galleryProp]);

    const convertToBase64 = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = () => {
                handlePictureUploadException();
                return;
            };
        });
    };

    const handlePictureUploadException = () => {
        setFailedUpload(true);
        handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Neuspješan prenos fotografije!")();
        return;
    };

    const handlePictureUpload = async (e: any) => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }

        const imageFile = e.target.files[0];
        if (imageFile === undefined) {
            return;
        }
        if (
            !imageFile.type.startsWith("image") ||
            imageFile.size / (1024 * 1024) > 3 ||
            images.length >= 25
        ) {
            handlePictureUploadException();
            e.target.value = "";
            return;
        }

        const base64 = (await convertToBase64(imageFile)) as string;
        const imageToSave = {pictureBase64: base64};

        const picture = await saveImage(numId, imageToSave);
        e.target.value = "";
        setImages([
            {
                id: picture?.data.id,
                pictureBase64: picture?.data.pictureBase64,
            },
            ...images,
        ]);
    };

    async function handleImageDelete(imageID: number) {
        await deleteImage(imageID);
        const updatedImages = images.filter((image) => image.id !== imageID);
        setImages(updatedImages);
        if (handleGalleryChange) {
            handleGalleryChange(updatedImages);
        }

        const newPageCount = Math.ceil(updatedImages.length / imagesPerPage);
        const newIndexOfLastImage = page * imagesPerPage;
        const newIndexOfFirstImage = newIndexOfLastImage - imagesPerPage;
        const newCurrentImages = updatedImages.slice(newIndexOfFirstImage, newIndexOfLastImage);

        if (newPageCount < page) {
            setPage(page - 1);
        } else if (newCurrentImages.length === 0 && page > 1) {
            setPage(1);
        }

        handleClose();
    }

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const lightboxStyles = {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10000,
    };

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 5,
            flexDirection: "column"
        }}>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <Box sx={{
                backgroundColor: "white",
                border: "1px solid lightgray",
                height: "auto",
                width: "95%",
                minHeight: "72vh",
                boxShadow: "5px 5px 20px 3px rgba(0,0,0,.08)",
                paddingBottom: "20px",
                boxSizing: "border-box",
                overflow: 'hidden',
                position: 'relative',
            }}>
                <div style={{maxHeight: "45px", display: "flex", flexDirection: "column", marginBottom: "1.5%"}}>
                    <p style={{
                        fontSize: 15,
                        paddingTop: "2px",
                        color: "#3696ab",
                        fontWeight: "bold",
                        marginLeft: "1%",
                        fontFamily: "openSans"
                    }}>Dodaj fotografije</p>
                    <Divider style={{
                        backgroundColor: "rgba(84,90,109,0.13)",
                        width: "100%",
                        height: "0.1vh",
                    }}/>
                </div>
                <Grid container spacing={2} className={classes.gridContainer}>
                    {page === 1 && (
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Box className={classes.upload}>
                                <input
                                    accept="image/*"
                                    style={{display: 'none'}}
                                    id="icon-button-file"
                                    type="file"
                                    onChange={handlePictureUpload}
                                />
                                <label htmlFor="icon-button-file" className={classes.uploadContent}>
                                    <AddPhotoAlternateRoundedIcon className={classes.addPhoto}/>
                                    <Typography variant="subtitle1" style={{color: "rgba(54,150,171,0.75)"}}>Dodaj
                                        fotografiju</Typography>
                                </label>
                            </Box>
                        </Grid>
                    )}
                    {currentImages.map((src, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <div className={classes.imageItem}>
                                <img src={src.pictureBase64} alt={`gallery-${index}`}/>
                                <Box className="overlay">
                                    <IconButton style={{
                                        backgroundColor: "#4a828c",
                                        color: "white",
                                        marginRight: "5px"
                                    }} onClick={() => {
                                        setImageIdToDelete(src.id);
                                        setOpen(!open);
                                    }}>
                                        <DeleteIcon/>
                                    </IconButton>
                                    <IconButton style={{
                                        backgroundColor: "#4a828c",
                                        color: "white"
                                    }} onClick={() => setCurrentIndex(index)}>
                                        <ZoomInIcon/>
                                    </IconButton>
                                </Box>
                            </div>
                        </Grid>
                    ))}
                    {imageIdToDelete !== undefined && (
                        <AlertDialog
                            open={open}
                            setOpen={setOpen}
                            handleClickOpen={handleClickOpen}
                            handleClose={handleClose}
                            handleSave={() => handleImageDelete(imageIdToDelete)}
                            dialogContent={'Klikom na dugme "Potvrdi" fotografija će biti izbrisana.'}
                            dialogTitle={"Jeste li sigurni da želite izbrisati fotografiju?"}
                        />
                    )}
                </Grid>
                {currentIndex !== null && (
                    <Lightbox
                        mainSrc={images[currentIndex].pictureBase64}
                        nextSrc={images[(currentIndex + 1) % images.length].pictureBase64}
                        prevSrc={images[(currentIndex + images.length - 1) % images.length].pictureBase64}
                        onCloseRequest={() => setCurrentIndex(null)}
                        onMovePrevRequest={() =>
                            setCurrentIndex((currentIndex + images.length - 1) % images.length)
                        }
                        onMoveNextRequest={() =>
                            setCurrentIndex((currentIndex + 1) % images.length)
                        }
                        reactModalStyle={{overlay: {...lightboxStyles}}}
                    />
                )}
            </Box>
            {pageCount > 1 &&
                <Box className={classes.paginationContainer}>
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        classes={{
                            root: classes.ul,
                        }}
                    />
                </Box>
            }
        </Box>
    );
}

export default Gallery;
