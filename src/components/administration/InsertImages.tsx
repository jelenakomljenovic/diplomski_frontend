import * as React from 'react';
import {useEffect, useState} from 'react';
import {createStyles, makeStyles} from "@mui/styles";
import {Image} from "../../api/image/imageType";
import {Box, Container, IconButton, ImageList, ImageListItem, Pagination, Theme} from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import "./img.css";
import {deleteImage, getAllImagesByUniversityId, saveImage} from "../../api/image/imageApi";
import {useParams} from "react-router-dom";
import Lightbox from "react-image-lightbox";
import ConfirmationModal from "./ConfirmationModal";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "0px !important",
            width: "200px !important",
        },
        imageList: {
            flexWrap: "nowrap",
            [theme.breakpoints.only("xs")]: {
                flexDirection: "column",
                marginBottom: 20,
            },
        },
        input: {display: "none"},
        upload: {
            width: "13rem",
            height: "91%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `3px dashed #3696ab`,
            margin: 4,
            "&:hover": {
                cursor: "pointer",
            },
            [theme.breakpoints.only("xs")]: {
                width: "auto",
            },
        },
        addPhoto: {
            fontSize: 40,
            color: "#3696ab",
        },
        mobile: {
            [theme.breakpoints.only("xs")]: {
                width: "100% !important",
            },
        },
        purpleCircle: {
            background: "red",
            borderRadius: "50%",
            padding: theme.spacing(1),
            color: "#fff",
            margin: theme.spacing(0, 1, 0, 5),
            [theme.breakpoints.only("xs")]: {
                display: "inline-flex",
                margin: theme.spacing(1, 1),
            },
        },
    })
);

type NurseGalleryProps = {
    galleryProp?: Image[];
    handleGalleryChange?: (gallery: Image[]) => void;
};

export default function InsertImages({
                                         galleryProp,
                                         handleGalleryChange,
                                     }: NurseGalleryProps) {
    const classes = useStyles();
    let numId = 0;
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>();
    const [failedUpload, setFailedUpload] = useState<boolean>(false);
    const [imageIdToDelete, setImageIdToDelete] = useState<number>();
    const [imageIdToApprove, setImageIdToApprove] = useState<number>();
    const [gallery, setGallery] = useState<Image[]>([]);
    let {id} = useParams();
    const [page, setPage] = useState(1);
    const [imagesPerPage, setImagesPerPage] = useState(9);
    const pageCount = Math.ceil(gallery.length / imagesPerPage);
    const indexOfLastImage = page * imagesPerPage;
    const indexOfFirstImage = indexOfLastImage - imagesPerPage;
    const currentImages = gallery.slice(indexOfFirstImage, indexOfLastImage);


    const toggleOpen = () => {
        setModalOpen((modalOpen) => !modalOpen);
        if (imageIdToDelete !== undefined) {
            setImageIdToDelete(undefined);
        }
        if (imageIdToApprove !== undefined) {
            setImageIdToApprove(undefined);
        }
        if (failedUpload) {
            setFailedUpload(false);
        }
    };

    async function handleImageDelete(imageID: number) {
        await deleteImage(imageID);
        setGallery([...gallery.filter((image) => image.id !== imageID)]);
        if (handleGalleryChange) {
            handleGalleryChange([...gallery.filter((image) => image.id !== imageID)]);
        }
        toggleOpen();
    }

    useEffect(() => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }

        async function fetchPictures() {
            const response = await getAllImagesByUniversityId(numId);
            setGallery(response.data.gallery);
        }

        if (!galleryProp) {
            fetchPictures();
        } else {
            setGallery(galleryProp);
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
        setModalOpen((modalOpen) => !modalOpen);
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
            gallery.length >= 25
        ) {
            handlePictureUploadException();
            e.target.value = "";
            return;
        }

        const base64 = (await convertToBase64(imageFile)) as string;
        const imageToSave = {pictureBase64: base64};

        const picture = await saveImage(numId, imageToSave);
        e.target.value = "";
        setGallery([
            {
                id: picture?.data.id,
                pictureBase64: picture?.data.pictureBase64,
            },
            ...gallery,
        ]);
    };

    return (
        <Box style={{
            backgroundColor: "rgb(255,255,255)",
            width: "100%",
            minHeight: "89.1vh",
            height: "auto",
            marginTop: "-1%"
        }}>
            <Container maxWidth="lg" style={{paddingTop: "5%"}}>
                <ImageList className={classes.imageList} cols={5} gap={10}>
                    {
                        page === 1 && (
                            <div className={classes.root}>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="icon-button-photo"
                                    type="file"
                                    onChange={handlePictureUpload}
                                />
                                <label htmlFor="icon-button-photo">
                                    <div className={classes.upload}>
                                        <IconButton color="primary" component="span">
                                            <AddPhotoAlternateRoundedIcon className={classes.addPhoto} />
                                        </IconButton>
                                    </div>
                                </label>
                            </div>
                        )
                    }
                    {currentImages.map((image) => (
                        <ImageListItem key={image.id} className={`${classes.mobile} image`}>
                            <img src={image.pictureBase64} alt="hospital"/>
                            <div className="overlay"/>
                            <DeleteIcon
                                style={{width: "40px", height: "40px"}}
                                className="delete"
                                onClick={() => {
                                    setImageIdToDelete(image.id);
                                    setModalOpen((modalOpen) => !modalOpen);
                                }}
                            />
                            <ZoomInIcon
                                style={{width: "40px", height: "40px"}}
                                className="delete zoom"
                                onClick={() => {
                                    setCurrentIndex(gallery.indexOf(image));
                                }}
                            />
                        </ImageListItem>
                    ))}
                    {imageIdToDelete !== undefined && (
                        <ConfirmationModal
                            modalOpen={modalOpen}
                            handleClose={toggleOpen}
                            handleAction={() => handleImageDelete(imageIdToDelete)}
                            modalText={'Klikom na dugme "U redu" fotografija će biti izbrisana.'}
                            title={"Jeste li sigurni da želite izbrisati fotografiju?"}
                        />
                    )}
                    {failedUpload && (
                        <ConfirmationModal
                            modalOpen={modalOpen}
                            handleClose={toggleOpen}
                            modalText={"Neuspješan prenos fotografije!"}
                            title={"Greška!"}
                        />
                    )}
                    {currentIndex !== undefined && (
                        <Lightbox
                            mainSrc={gallery[currentIndex].pictureBase64}
                            nextSrc={gallery[(currentIndex + 1) % gallery.length].pictureBase64}
                            prevSrc={
                                gallery[(currentIndex + gallery.length - 1) % gallery.length]
                                    .pictureBase64
                            }
                            onCloseRequest={() => {
                                setCurrentIndex(undefined);
                            }}
                            onMovePrevRequest={() =>
                                setCurrentIndex(
                                    (currentIndex + gallery.length - 1) % gallery.length
                                )
                            }
                            onMoveNextRequest={() =>
                                setCurrentIndex((currentIndex + 1) % gallery.length)
                            }
                        />
                    )}
                </ImageList>
                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                />
            </Container>
        </Box>
    );
}
