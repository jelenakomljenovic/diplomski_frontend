/*global google*/
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Divider, Menu, MenuItem, MenuProps, Snackbar} from "@mui/material";
import {FaLocationDot, FaPhone} from "react-icons/fa6";
import {PiLinkBold} from "react-icons/pi";
import university from "../assets/university.png";
import {Link, useNavigate, useParams} from "react-router-dom";
import {CreateFacultyRequest} from "../api/faculty/faculty";
import {getUniversityById} from "../api/faculty/facultyApi";
import {backendUrl, paths} from "../constants/urlConstants";
import axiosService from "../axios/axiosService";
import AppsIcon from '@mui/icons-material/Apps';
import {DeleteOutline, PhotoCamera, Stop, UpdateOutlined} from "@mui/icons-material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import {getAllDepartments} from "../api/faculty/departmentApi";
import {Department} from "../api/faculty/department";
import {CreateDepartmentDialog} from "./CreateDepartmentDialog";
import {UpdateDepartmentDialog} from "./UpdateDepartmentDialog";
import {alpha, styled} from "@mui/material/styles";
import {Roles} from "../constants/constants";
import {hasRole} from "../token/token";
import AlertDialog from "./dialogs/AlertDialog";
import {MdEmail} from "react-icons/md";
import ReactImageLightbox from "react-image-lightbox";
import {useSnackbarHelper} from "../util/toastUtil";

const google = window.google ? window.google : {}

export const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        autoFocus={false}
        {...props}
    />
))(({theme}) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        backgroundColor: "rgb(252,251,251)",
        marginTop: theme.spacing(1),
        minWidth: 130,
        color:
            theme.palette.mode === 'light'
                ? 'rgb(55, 65, 81)'
                : theme.palette.grey[300],
        border: "1px solid darkgray",
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
    },
}));

function FacultyDetails() {
    let numId = 0;
    let {id} = useParams();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [faculty, setFaculty] = useState<CreateFacultyRequest>();
    const [openAddDepartmentPopup, setOpenAddDepartmentPopup] = useState(false);
    const [openUpdateDepartmentPopup, setOpenUpdateDepartmentPopup] = useState(false);
    const [departments, setDepartments] = useState<Array<Department>>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDeleteUni, setOpenDeleteUni] = useState(false);
    const [departmentIdForDelete, setDepartmentIdForDelete] = useState<number | undefined>(-1);
    const [departmentName, setDepartmentName] = useState<string | undefined>("");
    const [selectedDepartment, setSelectedDepartment] = useState<Department>();
    const [isOpen, setIsOpen] = useState(false);
    const [imagesArray, setImagesArray] = useState<Array<string>>(["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUQAAAFECAYAAABf6kfGAAAABHNCSVQICAgIfAhkiAAAIABJREFUeF7tXQecXFXVv+9N274pm14JLSEEYgi9KiBVCUX5UD5AQARFKR8o+IGooKDSFBSUjp8dCGhoUqSDpJAQSoQQsumbZLN9d+p737mzO7Mzs7Mz7717Z+bOvP/9Oc6Svee8c//nvv+e287VGAoQAAJAAAjEEdCAAxAAAkAACPQjAEJETwACQAAIDCAAQkRXAAJAAAiAENEHgAAQAALpCCBCRI8AAkAACCBCRB8AAkAACCBCRB8AAkAACGRFAENmdAwgAASAAIbM6ANAAAgAAQyZ0QeAABAAAhgyow8AASAABHIhgDlE9A8gAASAAOYQ0QeAABAAAphDRB8AAkAACGAOEX0ACAABIIA5RPQBIAAEgIAFBLCoYgEkVAECQMAdCIAQ3eFntBIIAAELCIAQLYCEKkAACLgDARCiO/yMVgIBIGABARCiBZBQBQgAAXcgAEJ0h5/RSiAABCwgAEK0ABKqAAEg4A4EQIju8DNaCQSAgAUEQIgWQEIVIAAE3IEACNEdfkYrgQAQsIAACNECSKgCBICAOxAAIbrDz2glEAACFhAAIVoACVWAABBwBwIgRHf4Ga0EAkDAAgIgRAsgoQoQAALuQACE6A4/o5VAAAhYQACEaAEkVAECQMAdCIAQ3eFntBIIAAELCIAQLYCEKkAACLgDARCiO/ysVCsnTZo02uv1Nui6Xh+LxRo8Ho9uGEY3/dzl8/k6Q6FQ16ZNm3qVMhrGuAIBEKIr3Fz8Rk6ZMuVQIr0jTNOcTk+fTJ9Jmqbx70Yr1pBcD9VbRTIfElmuop8/CAaDr7e0tGy1Io86QMAJAiBEJ6hBZggCO+200zT6xy8QkR1N30cRkdUUCKaV9IwX6fNsJBJ5GZFkgVB2qVoQoksdL6PZFAVOpGHvGfT5MunbT4ZOOzqIFINEvI9SBHlfc3PzSyRr2pFHXSCQiQAIEX3CNgLTp08/iYjoChI8xLZwgQSIHD8lm+6n73vXrl27pUCPgdoKRwCEWOEOltg8HxHhmaTvu0Q8MyXqlapqIGq8PxwO37hx48YNUpVDWcUjAEKseBeLN3DatGnnEQn+iD6TxLUVTwOR48P0+SENpz8t3lPxpHJGAIRYzt4rsO1EhMfR/ODP6TF7FvhRhVQfJlK8vbu7+4bt27d3FfJB0F3+CIAQy9+H0lswderUGbQ38Lek+CjpykukkEixlT7fo2jxvhKZgMeWAQIgxDJwUhFN1GmekC+W8OFxVRGfW7RHESm+TG07/dNPP20p2kPxoLJBAIRYNq4qrKFEhHyh5E9EFnML+yQltG+jUzFnrFu37gUlrIERyiAAQlTGFaUzhMhwARHhwtJZUJonU7R4I23R+X5pno6nqogACFFFrxTRJjphchYRwwNEiHoRH6vSo/5Gw+czyKCYSkbBltIgAEIsDe5KPJUiw6uJCH+qhDElNIL+IDxNkeICMiFcQjPwaAUQACEq4IRSmEBk+FMiw6uL9Wy+ykvP+oh/6Lmf0HG7HfTdSt/baWtPLf1+NH2Pot+Po88s+uxGn12LaN9LfX19J1LyCJ5UAsWlCIAQXej4YpAhEdxSIryXifBep+83nB6no72QB5KLDiIdB9H3MfRdW0CXvUoJI47ZsGFDXwGfAdUKIwBCVNg5hTCNyPBGIpWrCqGbdG4nIvwDkeDvaAX3A9nPGDNmTF1tbe2XyP5zSXdBzlGT/f8k8j6e9GNOUbYDy0AfCLEMnCTLRCLDH/AjeLL0peh5m4jkN0QkDxVAd1aVtBi0O/3iYvqcQ586mc+ltjwxMKcoUy10lQECIMQycJIME2noeQLN0S2SoStFx+JoNPqt9evXL5as17K6pqam+rq6uiuI6H9gWchaxTtp9fnb1qqiVqUgAEKsFE/maMfEiROnBAKBlVTFUrZqC5B00LD4f+kY3G+orhI5CCdPnrwLXT9wP9lzqAX7LVWhNp5AbXzKUmVUqggEQIgV4cacjfDT8HIJ1Zgjo6l8jo1S+Z+5ZcuWbTL0ydbBM/NQJHyLDPKntrbRIsteSCMm20vq6gMhqusbKZbRvOHtNJy8RIKyDtJxAQ0j/ypBV0FV8EzedJ/Lw/SQIyU86BVq8+ES9EBFGSAAQiwDJzk1kaKleUSGS+gj6md+sdNhRAz/cWpLCeQ0av9vKVr8uoRnX0ltv1mCHqhQHAHRF0Xx5rnaPJ2GyisIAaFchjRsXEt8egQRQnM5okkR8g/J/utEbCcM+mjxaFfan7hRRA9k1UcAhKi+jxxZSNHR5QNzaY7kB4RW0/ch5Z4qi7D4H8JCKMLjt/zRVpxjRcCErPoIgBDV95FtC8ePHz+mqqqKR3YiV4GuplXWw2iVdbNtAxQUkHFum0jxDCLFPyvYPJgkCQEQoiQgVVJDL/+tRIaXCdi0jS5pmldpq6s0hcBXny93igu/2Y8IcYZTecipjwAIUX0f2bKQXnqeHGEdffy2BAcq00vPj6wdTC/+v53IKy6jET4vkY2HCdj5dZpCuFdAHqIKIwBCVNg5Tkyj6PA3FB1e5ER2QOY79MLfISCvtChtUm/y+/0rCKOJDg1dR/hMcygLMcURACEq7iA75vGXnU6kiGyYdsWeO7pE60S6ROsfdrDNqMv3Y94jIA9RRREAISrqGCdm0XCQXxD1CyeyJBOmUxmzaWsJX1mu+EKR9EKKEnlSWNuFphVW0ZQCz9mIUmEIgBAryKH0kq+il5xngbFd6CX/Mb3kQvv1bD+0hAJ09nkSnX3e4NQEuqRqPqU4W+pUHnJqIgBCVNMvtq2ivXYH0V67120L9gt0hEKhiZs2bep1KF+WYiKJcukPyF30B+SbZdlwGD0sAiDECukc9HLfTdHhNxw257s0J+Z0qO3wkaUXmzFjRiPttVxDuPGrC2wVIsR2EphApBi0JYjKSiMAQlTaPdaNo/nD9VR7snWJZM1Omjsc79a0+SJJc4lMj6eN6087wBwiiiIAQlTUMXbMGsgF+LEdmURdtw/9iBDHExYbHV7DejNF1lc6wR0yaiIAQlTTL7asopf6G/RC321LaKAyLQ7MLsT9J05sKZUM4fck4cfvUbFV6I/JMhoy72NLCJWVRgCEqLR7rBlHw2Weo/BL1moP1qIX+n16oYWy4dh9por1iRDPIEL8oxPbSG7EmjVreK5IlApAAIRYAU4kQuSpuababQoR4u1EiCJnnu0+Usn6PBlGdXU1z/nopHyRhs0im7ydPBMyBUIAhFggYIullk6n1NDpFEeXq9Nw+Qs0XJZ98VSxmi71ORQlvkfR3my7SumPytX0R+Umu3KoryYCIEQ1/WLZKkqXP5/S5Tu69a67u7t+27Zt3ZYfVsEVKcr+NTXP9r5CIsSHiBDPqWBoXNU0EGKZu5sim7MpsnnQQTOaaag33YFcRYrQxvZv0sZ2Toq2ChHiv4kQD7AlhMrKIgBCVNY11gyjyOYnVPP71moP1qIX+Wl6kW2vrNp9TrnUJ0L8HBHiCw7s7aY/LPUO5CCiIAIgRAWdYsckgaHebUSIjpOl2rGxHOqKnG3u7e2ta2lpcTSPWw7YuMlGEGKZe5sI8ffUhDMdNONaimxucCBXqSI8eazhpHF0AdWk9evXb3IiCxm1EAAhquUP29bQHOITNIf4RbuCNGS+nCLE2+zKVXJ9IkR+Ljlgt42E5SzCcpVdOdRXDwEQono+sWUREeKLRIiftSVElekl/ga9xL+zK1fJ9YkQW6h9Yx20cX+Ktt92IAcRxRAAISrmELvm0Ev8GskcbFeOEhOcR4kJ7rcrV8n1CUt+F80Uu20kLI8kLF+0K4f66iEAQlTPJ7YsogjxdYoQD7IlRJVBiEMRc0qIpOnzFCE+Z9cHqK8eAiBE9XxiyyIQoi24clYGIcrDslw1gRDL1XMDdoMQ5TkQhCgPy3LVBEIsV8+BEKV7DoQoHdKyUwhCLDuXpRuMCFGeA0GI8rAsV00gxHL13IDdTleZadvNubTt5oEyb75U852mUaOsQUdR1iAnx/6k2g9l4giAEMUxLKkGEKI8+AnLd0nbHLsa6aTKLnRS5RO7cqivHgIgRPV8YssiEKItuHJWJiz5Ucb/taORIu03KNK2vQ/UzjNQt3gIgBCLh3VBniRAiF+jF/nBghhVpkppPnYE7elcSeZbvb1wJRHiFwnHtWXaZJidgQAIscy7hAAhYg4xi+8pDdgsSgP2EP1q3+G6BpHgv3gOStqM/XCZdx+YD0KsrD6AVebK8idaU1oEECGWFn/hp4MQhSGEAiCQRACEWOadAYRY5g6E+UohAEJUyh32jQEh2scMEkBgOARAiGXeN0CIZe5AmK8UAiBEpdxh3xgQon3MIAEEECFWaB8AIVaoY9GskiCACLEksMt7KAhRHpbQBARAiGXeB0CIZe5AmK8UAiBEpdxh3xgQon3MIAEEMIdYoX0AhFihjkWzSoIAIsSSwN7/0LkLFo7waebehqnN1XQ2wokpwW2vnGfG+mzfFOepmfaEv2HmO06eWaky4Y739zeNcI3d9nlrp63w+EftsCsXr2+ay6Om1rz88ZOXO5KHkFQEQIhS4cyvjJOgh7GzmdFzluatmZdfAjXcgIAZC7YyTX9WY4F7ljx+8ktuaLOKbQQhFskrRITTdbP3Jt1TfXqRHonHlCkCRiy0VdMD31268BSedQeliAiAEAsMNo8IdaP7+7q39soCPwrqKwwBM9q3RtNrzkPEWDzHghALiDWR4Vw91rlI99VPKuBjoLrCETCj3bcs/ftZV1R4M5VoHgixQG7Y8/iH5/t9/td1j99foEdArYsQMCJtTxqeUWfS4ku7i5pd9KaCEAsA+d4n3nuxzz/qjgKohkoXI2BEutYbnoa9QIqF6wQgRMnYzj72gX2rAlVvap4ALSajAAG5CNB6ywvvPHnhUXK1QlsCARCixL4QX0Axg1t1T8AnUS1UAYE0BGLBrXe/89SFFwEW+QiAECViOu+Eez7RA6NnSFQJVUAgKwI0ej5lxXOXLAQ8chEAIUrCc++jb73QVz/9LknqoAYI5EQgFtqx450nzx8NmOQiAEKUhOe8LzzUQ9trbB/7kvR4qHEhApGeNdetePaKH7uw6QVrMghRArR7Hnn9T6saZ18tQRVUAAHLCMTCHaF3Fn2tyrIAKuZFAISYF6L8Fead8LtOPdBUn78magABuQgEd7x35Xsv/eBmuVrdqw2EKOj7PY/8yV5VjbNWCKqBOBBwhEC465P33n3uyjmOhCE0BAEQomCnmH3YFQ9WNx10tqAaiAMBRwgYsaCx7ImvYM+rI/SGCoEQBYHc6+ibt/jrZ4wTVANxIOAYge4tr5226o1bH3WsAIJJBECIgp3hM8fd1eepHoeJbUEcIe4cgb6tb970/mu/wKKecwhBiBKwi6uYf8pjpixd0AMEnCBAmb6fefeFa49zIguZdAQQIQr0iMmTJ1eP3+9XvQIqIAoEhBEItS17Y+W/bjhYWBEUMBCiQCegC57GN827dbOACogCAWEEwu0r33/3xev2FFYEBSBEkT4watSohhlH3NshogOyQEAUAUr2sJGSPUwW1QN5BkIU7AQemkOMCupwpfiEMdVsXFN1su2frOtiXT0RV2Ih2uhYcNu6d576xjRRPZAHIQr3ASyq5Idw7qxRbO5M+swaycaPrmLjiQyHK1u29bEtrUG2/MM2tnzVDvp2drtnfqsqp0Ys1PrpO09+HVmWJLgUc4iCIIIQswO4y7R6dtrnp7KD541l9bXO00PyqPH1ZVvZI/9cx1Y3dwl6qzLFKfPNasp8s2tltq64rQIhCuINQkwHkEeD55y8M0WEIwWRHSq+fFUbe3DhJ4gaM6Axwu3/Wbbo3JnSAXehQhCioNNBiP0A8jnB7319z2GJcMv2vnikt3lbkK2m+cIW+u/NNDxOlMScYn2Nj4bWI+JD7J2nZs+XwYnxZ/e8lyYv6MayFjcinR8s+8c5s8u6EYoYD0IUdAQIkbFTPz+NosIZQ4bGnAQfeXbdABEOkp9VyPlQ+5hDJrLTjpnKxqcswCTkH1y4hiLG1VbVVWw9I9y9ctmis/aq2AYWsWEgREGw3UyInLC+9ZXd2LGHpl87zYnwISKrp1/dKIjuoPih+4yLk25m1Pjq0hb283s/cPUKtRntXb7072d+RhrYLlYEQhR0vlsJkZPhbVfNZ3zxJLXc+Yf/UFTYLIjq8OKnHdMfjdbR0DpR+GLLZTctcS0pmrHQ20ufOGP/goHuIsUgREFnu5EQs5Eh30d4I83rWV4JNk2mM4PQ50fBzfiGWCP+/zoz471SH9YzfL7xhkvmpkWLriZFk728ZOEpRwh2ZYgTAiBEwW7gNkLMRobPvLqJ3URkmK3oRpSoLco0M8I8ZowWX/zs0H0nsEP2m8h23Wkkq6NIc/Wn7Wzz1h722tsb2euLN7HugQ3aMeZhpu4hovQRSXpZjD6m1p/6r3+4vjsN1yciUgQhCr7Fg+IgREEo3UaI11+yN+PzeYmSSYa6ESbi459o/DtROPF962tz2XGfnZ4TcU6GD/zlffbokx9nrcejSEPz08fHYrqfffeCuWmkyFegL/3pYkGvlpk4CFGaw0CIglC6iRD5/N3FX919CBl6ePQXCzKvGSS6GpoNbZfpI9jtPz4iHg1aLa/+eyP72a8XJ6PF4eR4FHn5RQezzx82NVmFrzzzFWjXFBCiNFeDEAWhdAsh8nm7P91yaBItPmd4xU9eZaHODiLB2LAojh9by+69+WhbZJhQxknx2p+/kddDdbUBdtO1R7Gdpg1uBj//2jetz2fmfYLiFUCI0hwEQhSE0i2EePv3901uuu7ujbCrrn+efbq2NS96995yNOMRotNyx/3L2aOLaPicp6dyUrz/Vyex2hp//FErPmxll9y41Oljy0sOhCjNXyBEQSjdQIh8zpDPHSbK7x5eyp54+sNhkTNpBZkz2HGfm86uunhfIYT5nOJ/XfRkxtDZZPwRmpbefU86bha74Kx9ks+79bdvs0WvtdJ8Y4XfwQRCFOpjqcIgREEo3UCIf77lEMpQUxNHauu2bva17zyeBTViqPj/NCKq/l/zecO5s8cIIszYTXcuZs/8a226nvhUJZ+xpK079Dx6avz3d950QnLo3DJga1SrYWFvbbx+RRYQojS3VmgPkYZPXkWVToj77lbNfnHN4NzhDbe+wt5cvG4Ql/5QbQhOfAFl0cML8uJnpQLfjnPNz3LPJcbNIGVzZo+j+cSjk2oT9vLV6bC3gbbuBKw8srzqgBCl+QuEKAhlpRKiRttmqqId7H8u2o8dddjOcZQ+bW5jF1/1ZPzn+KA4saCcpRfNnT2WIsTDBdHtF+f7FM+/4jlruogZ7/zZicko8c0l69kNt7yclI3o1Sys0+maSur5IERrfcNCrUrqFhaaK79KJRKi1+hjgVgXrQwH2F/u/VISND53+PjA3GG+jiOTELkBR5z6N8vOO+rwndllFx6YrH/6+X+jOchQ8r8N2qoT9DbGN3tXRAEhSnNjvn4t7UGVqqiiCJGiKz8RoY/2E/Jy4L5T2TWXH5Z03bnfWcha6ESJlehKJiHyhZUTz8o2b5m9V2WuON9295vs+Zc/SavMg9uQp5E2d1fAEBqEKI1eQIiCUFYMIRIZBmIdtLl68HTJZRcdmHW4bAUyvv/wz3cdb6Vq3jrL39/GLv3BS3nrpVbg+xLn7DE+/k+cDDkpZpZ+UqR5Rb3Klm7lKoMQpbkEhCgIZUUQIpFhVaydjtqlX/J0x40nsBnT+zc7/+GRFeyPj660hdaf7zqBjR/bvzotUh6hfYh3PrDcloqvnDqHffW0/q1CfLX53Kwr4/1zoWFPPYvS3GLZFhCiNNeBEAWhrARCrIpyMhyMDBOQPPmnM5PoXHX9c2zlBy220Drny7PZOafvYUsmW+X/uugptoUP1W2UOXukrzafcMb/9W8Lim/RGVp4pBgt10gRhGijZ+SuCkIUhLKsCTHLMDkBxww6BncH7elLFB5h8UjLTuFbb3iUaOcMc6Z+K1tuhrPJDqGX9ZwiCNFOt8xZF4QoCGU5E6I/2plcQMmEIWuE5QArnubrhu8d7ECSxU+nDD2lYl2VHULkWjkpBj0jmaFbT0Jh3ZoC1gQhSgMXhCgIZbkSojdGW2uM4a/1lEWIHN5jP2v/CB8nQ76Qsnptu2MP/fW+LyfPNmcd8mfZVM5P2vR5R9PQevgEtY4NKpQgCFEasiBEQSjLkRB1I0KLKG05d8+kEuLwx/Wsg8cjxasu3s/S8JmvKt9JSR1EyJBblrooZGcOlCei5ZFithM41ltcxJogRGlggxAFoSw7QjQNVh3dMZC+P6Xx/fkYkkVmhJhQyucSTzuBLqWiiDHb6jMnQL6iPOTcskMf2R0ypz4mTOefI946h08ushgIURrgIERBKMuNEAO0opy615A3n2enycwcUwhCTIWa71McP4YnXOgvW7b12F5Jzuc6W4SYZfgc9I6gs8/96cSULiBEae4BIQpCWU6E6DGCNFTutNTiGdNH0ZBzcGN1fNtKmRVbhJilbQbF0Xw+UfmhMwhRWs8EIQpCWTaEONxQOUf7RQlFEFoh8cwIN/M8c1blWaLEsE5DZ4/iQ2cQolBfSRUGIQpCWS6EGD+jTEkbUku2oXLq7x/41QI2dkw/GeRLCmsFxnGk64D5k9mcWeNoccVPumsZ/zde+KZvvs9x5Qdb2coP+38WKanJYkUWhfjUav+qs8JJZkGIIl0lTRaEKAhlORCiTqm8+EJKBhvmHQqmnmXOTKNlBzaePuyk42YmjwFakX1z8Xr2xDOrbJ+OSeh2anvG2lJcXZTmEUM0n6hsASFKcw0IURDKciBEP+U19JmD6a+sNjk1jVZ3T5idfv5frYrG6/Fh6wX/Pd8WEWY+gCdm4Geo7UaMf7n3y/Eo1Fl0O5QW+1TesA1CtNUvc1UGIQpCqTohajR3WBPdnhEd0n9a8Dwfzt5Pw+ZEyZZGazj4eD5CTqgyCifje36/dEgKr+F0D01bZv/YYeZ0YpQybYcoh6KSBYQozS0WXgtpz6pIRaoToj/K8xumzx3acUTqHSV8no9vcM5VeC5CnkORR4eyi1VC5lcIJJ6fmuXblj0ZjNg/lzhKzaSyIERbrkWEKA2uoYrUJkSD1UacRYeJlmZmn8514oOT4Y3XHCU0RM7nquFyGybkMrcLWSXRfM/lv49oVfF7WZQrIERpLkGEKAilyoTojfXSeeX01dph7oTKiULqanOuKPGayw+nLNtTBBHNLz7koqsUkdTFlJ7eMOVBfCLt+oD82gdrZM4k8nPOvd6mvItRdp4hpS4IUQqMXAkIURBKlQmxKrKDbg+JJluYb5vNcFBk3necjZAyI0lBWHOK8znF71z91JCFlsy9h06S2qY+ONsfj6CK1w6AEKV1NxCiIJSqEiK/Na/GwVab4eBIjRI5IZ13yWDkxRdffkWnWhKruoKQWhLPjFT5cP2+X56UtEE0OkwYYfbfNJ20ScktOCBES33GSiUQohWUctRRlRB9sW7mN3oFWzconrlyy/cJ3nBr//Weqen6pT3QgqLU+czM4XquYbUF1YNRdZZhVK9vTJwmlSkgRGmuUMir0tpUVEWqEqKs4XIqmBecNT++wTpR+ALHPb9flhaZFRP851+hy6PuejN+5WjqFh+RTeRW7A/qdDGVR6GLqUCIVtxmqQ4I0RJMw1dSkhBp72Ftxt7DbCcw7DadD0v5bXY70fUCibJmbVtBV5Xz2cg3bfMINVH4Mb1vX/2044WUbM/LnEuMaHTZvZcuu1elgBCleQKEKAilioToiVFWGyM9q43TBZVMePh84R03HZ/MRC0In1RxPm941fXPszVrM44pCj4l849JPAuOj1abVSkgRGmeACEKQqkiIfopxZePUn0VqvC9fjxSrK1RJ1dgocgwjmGW8LpXpYQPIERpXR2EKAilioRYFW2la0VjyZbJig5ToVKJFAtKhsP0j6DeSPOIAcHeI0kchCgJSOxDFAZSRUKsiWxNWwOVMX+YDShOipfTgkbqnKIwoDYVFIsMM/+ohPRaFvUMZvy2abbc6iBEaXgiQhSEUjVC1CgyrKEIMbUUihD5M/hCy6UXHsAOnF/4EyqZruKrybff/ZbUBZRhu0MGiEod4wMhCr7Fg+IgREEoVSNEjxGiawI6ikaIiQfxfYqXETEWY16RR4U8YS3f9lOsMjT7jZey34wq1uNzPweEKM0PIERBKFUjxHz3LQs2N6c4jxa/eOxubMHxswpCjJwIH3/qQ/b3Zz4qTlSYFmbTq6LxMLG/xM810wZtJQoIUZobQIiCUKpGiD5K6OBPTejgJJuDICacGI88bAZbcNzuySsIRFTyvYXPUTRYEiLMYXiPb6xIs+TJghClYQlCFIRSOUKM9jC/2TMYyVBQo5XQy3zh5YB9JrG9KD/inD3GW0Z75Qdb2LuUf/GtpRul7yu0bERKxWx/V3rimW90J+rkyoAQpeFZwldFWhtKqkg5Qsw4w1yCADGnP/jG7sTlUmObapJ1e3qjbE3zDtbTG1GCAIc0ItteRA9dPqUrcPkUCFEaB4AQBaFUjxC7aMg8mCE7M1uLYHNdK55tL2cfXTxlqHCRPQhRWr8EIQpCqRwhRinLjZmS5aaQe24EsSt38SBdPBXTfaVvBghRmg9AiIJQKkeIMZpDNAbnELMdOxNssivFs0aIqtzEB0KU1idBiIJQqkaIQ64NQIQo6OF+8Wxzsb2qXDoFQpTiY64EhCgIpXqEGKR7VFIy3YAQBT08QIhZXpYeSvDANCyqSAFYESUgREFHKEeIdFIlkHZSBYwo6OL+CDEbIcY3ZivwCiFClOHiuA4FvCmtLSVRpBoh6maYVUfb07BQbetNSRwl+NCsN/DhpIogquqJgxAFfaIaIbKs2bLTL0oSbLIrxTMXVaIazjJXYkcAIQp6VTlCpPbURLYh55pEAAAYqklEQVRR6D947hYrzYJOjo+Z04/8RPUAC9GVpEoUDJmluQGEKAhloQjR49FYfa2P+b0exn/mn9TrMHOZHYi1Mz0lQWzWJVLBdrtOPDP9l17Donp1ThgMItFYjD6GwYKhGOumUzicV6UXEKI0SEGIglDKJsSGOh9rrAuwmmqvY8v4FaRemktMFMwhOoZyWMGQp872KRVOkN09EbajI8RC4cGM5sLWgRCFIUwoACEKQimLEKsDXja2qZpV+cW3ceh8pTl1c7ZgG90unvkHhQd5Qc8Ix4kd+HHKru4I27YjyKIxQxxeEKI4hgMaQIiCUMogxDGjqtioRnn3/PKs2UOSxNJbrZUy7Y0gzqUUzzwPbjC+oNIgbJJhmGxjSw/rDUbFdIEQxfBLkQYhCkIpQoicoCaMqaa5Qvm31wWiHXRZpsRhmSBOlSTOrw+IegYz9Yi0jZNty/Y+1tE1OMVhWx8I0TZkwwmAEAWhFCHEyeNrWW11YZIDeOlMs88MDc4jxnM8w92C7o6LhzwNNH/ofI53qA39pNjulBRBiDLcGteBN0QQSqeEOH5MDS2e2I8MTzl6CjvmkAlJq19evJX9cdHaIa3QzQidWOlK+/fUubAvHLNbPKt1orz+9jr2tyc+sI3GN8/dl+22Mx1hGyh3P7iErfp4e9nr+cEVh7NRI/tXkbu6w+zaG1+M/8z/rPTPH8p9dXikuGELDZ/7HAyfQYi2+xsiRGmQpStyQogNRIQTiBCdlExCfPa1zeyx59ZnCTrM+BE+nQ1O2ucixBdeWcP+8exHtk3KJMRL//cZ2zq4gGp6UglxR1sf+/HNL8fbFdECBbt+lM8prtnQGd+qY6uAEG3Blauy3D9z0swqH0V2CZHPG86YUs+8Hmep5/fYpZFd8t+7JwEalhCphs/oZV4jmAZmYjvdzF2b2IXnzE/+zikhfumkPdjB+01N6nFKiKrpueSC/ZP3TacSovzhcnpfb+sMsq2t6T7L+zaAEPNCZLUCCNEqUsPUs0uIIxsCbOzo3Bt685n02x/tZ4kQNTNKq80pmW9IKjVKvP0nxwoTYubQ2ykhqqYnNWJNEKJB8XaIsmQXsvCh85r1XSwatbEdB4QozSUgREEo7RLizlMbLEeH3zxjVxpCdbNnXt2cZmUqIS58fn3a7w+eN4bN3KmB3fdo/53F/mgnu+DMvVjzunb2PA2LU0sqIS6i4XLq7w+YP5ntOmM0+/1fVyRFOEkse3cze2vJhuS/pRIZf4mvuO6fac/gv+cldTiukp6jaB51wvh6tvidjWlzn6mE2EK3/t14+2ssTCvLMVph5uW8U3dmqz7tZK8v2ybYg4aKt7YH2fY2G1EiCFGaD0CIglDaIcSAX2fTJ1nbv5Y6NO7qibIPP+lIklwqIX7jurfjLfjKidPZnrs2stEjAixCxHTx9Uvi/77nzrXs22fNjv/MFwc++qQ1SXKphJiI7PjQddauY+ILCqkElzqk5QTx3odb4ySXSoiJSIoPx/f9zCS2x25NrJpW0ROEwm1QTU9iaMzbyu189a11ccJPJUSO2a/vW8r22X8Xtt+cJrbz1Drm8+psxao29ps/fSzYg4aKB8NR1ryx27peEKJ1rPLUBCEKQmmHEDlZNQ2sXOZ7LI9A9ttrcPWW1+dE17yph+0ytT4pvmpNJ5s6sYbVVKVvA0msPmfTw1/+9Rs7knNkXBl/6adMbIgTWGpJrD5fefFBbNKEdDLv66NjaO19yX/nhNvZFWT8Zj0vEUZqSaw+q6bnxmuOHNJmTuy8JFaZOVGaNFzmOwNSC/9DdcXPl+VzpYPf9w+bub8tFRCiJZisVAIhWkEpRx07hDhpXA2rq7G21ebK82alEZ9dM1ev62K/uO9DJqrn0+Y29svf/Ztdf/XnWL2DbUIJuxPEqpKelR9sTVtYsosxr//L3/+HfbC6w4loTplNW3tYF517tlRAiJZgslIJhGgFJUmEOHVCHavOiORyPZ7PB+69+wg2eXxNfCicr7S2h2gvW++QeUeu5zO71bFJ4+uSUU8uXTxC2rila8i8I59vmz1zDGsaXZuXHHkU2trWyzZs6mIfr2lNm3dUTQ8fxk+fMoKNGlE9JFrMxIkfs2ttD1ME182W05C5EGTIn7m1tY+1dQ5urM/pexBivlfD8u9BiJahyl7RToS40+R65vc5S97A5xQP3LtpyDCaW8WHx/lezsSKc2J+b5+9Bzd3p0ZxPGqysrGaL7rsP29S2rCb6+HD6DcWr7e8p1E1PZysD9pvypA/HFu29bE3V2wfssAl2H2GFbe1/QaEKM0NIERBKO0Q4owpDfHJeKflp5ftnTVSXE9R4Q13vZdXbeI4X+qm41ShjZs72S/ufCOvHl6BE+v5Z84bMlfIf7d0xea01elcClXTk7n9J2E7n89b9NLGohFiJ83Hbt6Wcr92LhBBiJb6rJVKIEQrKOWoY4cQp02sY1WU5stJueaiPdkUGjrzkm1x5e13W5Or0MPqp02I1160B5s8oX9RJtviihUy4yT21dP2Sg6b+WJKb184vpiS0PvMC6uHbPPJtEslPXzD+tEUHR575C5Jkt+wuZsixarkghVfRLn/sU8KNkxOxcfW1hsQopNXKqsMCFEQSjuEaGdRJdWszJVivrJ820OrWGrEaCWCydTDV5Z/c/9ilhoxcpLMR2aZK8X8lMvHa3akRYycJP/wyLs5h98q6ckkZ47Dr//0Ee3pbEw7O241GhfsVqyltZe1d1rMgANCFIU7KQ9CFITSDiHyEyr8pIqdknl2OXWrx7GHTmAnHzUlqY5P+N/zt+wRzBA9KQkL+LzZiQMbqLkyPg/40F9WZCWzzDPHiVVoLnceDaHnzBqbtCd1/2Fmm1XTkzmN8MriLewPi9bFzf7RxXNoy83g6aJC7T9MxYjnSeRXDlgqIERLMFmpBEK0glKOOnYIsbbGyyaP6x9WWi2pQ2Uuk3ky5bKzZ7KZMwb3Bw73smbq+cc/V7MXXl6dNCOToFbSxuv7/i99j11mFJWNODOjzZffWDtkgUU1PfwPQupQeQvN3V135+CcLF/Q4qeGEvO/uf7wWPVrrnr8hr+PmzvpmKXFJA8gRBmwx3WAEAWhtEOIPGPUrtMabWeu5qdQDvpMU3xTNt9bmFr4y/r1L+0cf1lffKsle+abAYF0Pe+zAB3rS2TD4SR19ul7Mx+tgmcjsdRnJsgzW8qwRLTJh8xPPvdR2nab4aJEFfTw9p98wkw2emQN++OTzUOO5HFC3HvmSMaHzDy7UKG223CMeGTII0TLBYRoGap8FUGI+RDK83s7hMhVTRxb4yhDNic+XrK9iHzovG5zr6WXNFUPv2rATzkTE6TIyWwDrTRb3XaTeqY5FSa+Ums1lRjfdqOKnpjmZ/vOn85efyd7Pkc+7ZA11ZpgH8oU37yth3XSnSuWCwjRMlT5KoIQ8yEkmRD5kbYZtB9RlftNMklREA7lxTNuE03ay8kwrNdKT/xqFxB+G9/ajemJffPqACHmhchqBRCiVaSGqWc3QuRqmmgrx+gR8i6VEmxC/A5nX0qkKKpPWflh7mONkyFdK1r6YtK0SHf8DmdbBYRoC65clUGIglA6IUQ+lzhtYj0LSLhyVND8pLjbIsVEw6M6ZQfSaH+n5CsBnPjF1t7D1AeAEJ3AnVUGhCgIpRNC5I/kQ+edJtUzXVfJBQYttPA5xSwRynBjTUH8Ci0+TFAYf2xEr2FRXY1IvTcYYes321hIASEWpOuo9DYWpIGFVuqUELldNdVeOn2iwlAt/e3yx7qZhy6pyl4ybykuNMLO9eeyNOyppWSv9vaEOrckt2Q4EosPlfmdKo4KIkRHsGUTAiEKQilCiPzRVQEP7U2sZR6Hd6wImj+suNfso3nF/ryA2UquyKtQNlnVm8s2fg1AhOYL5V4jatWyofV4ZLixpdc5GXKVIETnDsiQBCEKQilKiPzx/MKpcU3VlCuxMHc0O22iboZpW04PbVbNHrnwCIyZA7c9l7gnxW+dNimhao65QE6CIZ0ics15gg2nWGbKGcTabR0he1cFDPvXib28ZOEpR8iyzc16StyNyx96GYSYQIGnBuN5D/k1paoUTjL89j4PkWPuQvRI5Mi3+hetUw3Ma+aLVjlZRjzVyftQSoktP3PeTnkO+aX0jofImQ1AhCjNpUXru9IsVkyRTEJMNE2nKIcf86uv9VP+RD2+8CKSNkwGZPziex9Fi6n3PGcfSvezVEEXbYl4TY3TXP4S1f3xxRNGlhe7cMKLGkb8nuVgMBbPgN0XcnARfT7DQYj5ELL8eyt9yrIyN1YsBCGqjKPX4HOLvdlXorMYHh9Wc4ociB7tLVb3D9b5/9uTo9RmtGASoYUTVeYKC+pTEKI0eEGIglC6jRATcHmMMA2le3KsRucdYcejvPgAOz7mpR/jpBmfDXTklfjQWKfbAikiNBWYJ3TUCCdCIEQnqGWVcdbzpD2+/BW5lRATnuNzjF4jyLwmRY18UaPIhVMqP2kSixMhn3t1X5emvydPLF14yoIiQ1+Rj3Nf75HsRrcTYiqcfO+ih8iRR49ZN3dLxD6q+Wg4XMWinkD8ilB3F/NHSx479YfuxkBO60GIgjiCELMDyI8CemllWjdCFDlG8y7G5HMDxaEUCfooEgzQh29PQtcdxAyEmK//WP09epVVpIapt88pj66lOa9pgmpcIE5bookkdSNGVGZhpZWWqc04CXppPtDZTYUuADXeRIOZly177NTb3dLeQrYThCiI7vyTH3uJ3vDDBdVAHAg4R8DQPrvk8ZNfcq4AkgkEQIiCfWH+KY/S3I12naAaiAMBxwgseewUvMeO0UsXBJCCQM5dsHCuVzffEVQDcSDgCAGsMDuCbVghEKIEPDGPKAFEqHCEAM0ffo3mDx90JAyhIQiAECV0CgybJYAIFbYRoPM7HTFDn7788ZPbbQtDICsCIEQJHYOGzSM8usFXm/tvgkIBAkVBANttZMMMQpSEKKJESUBCjSUEEB1agsl2JRCibciyCwxEicuxJ1ESoFCTEwHsPSxMBwEhSsR1/oKFR9Du439JVAlVQGAoAkjmULBeAUKUDC2GzpIBhbo0BDBULmyHACEWAN99Tn7sQTp5dnYBVEOlixEYIMMjaFV5uYthKGjTQYgFghekWCBgXaoWZFgcx4MQC4jzvFMevVRn2m0FfARUuwABOo2yImZqCygyXOuC5pa0iSDEAsPPj/bRHsXHsfpcYKArVD2R4S8p+eulFdo85ZoFQiySS/hiC2V3vhSbt4sEeLk/hlaSo6Z2KeYLi+tIEGIR8eZ7FXXdWEAXLl1Kiy57F/HReFQZIMDnCSn54+M0PL4dRFgah4EQS4M7I3KcTuR4BJHjXHLCXIoeR4AkS+SMEjyWkx/5fjn5vV3TzOXM0F9CTsMSOCLjkSDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRwBM4AAECg9AiDE0vsAFgABIKAIAiBERRyhmhnvv2/699iDebZvZ16vl3n6+rq8noZ6jyfY59V1zRMKMZ1/a1VM08JM1zRNpzZoES2s0//pmt+nadHIwL/7tKhGPzNN99H/RRnVj1F9L8lqjMsxM8JM+jJMj2nw/zRNZniZ1+DfjEVM0+ujn03DDEdMn4//zP+d16N/85NcsP9nv5/FDKOKPj2xqqraaJvREauJNEYjERabMIFF6YFh1bCGPeogAEJUxxdSLCFSqNnQ2VlVFW4IxGLBKq9XD8Q8WsCMRat0QwtEicJ8BguYuhbQDIO+6WeTfm8aVcRe9M2qpBiiuBIi4hCRY9Aw+bcZ0unbMMyQQT9rhiek62YwptO/695gNGaGarxGMBKpCoVCXSHvpPrgeE3rUbyJMM8BAiBEB6AVQ4SIrbqlpbue6KuOhaL1zKfXMVOvMY1YlW5qVRSdBUyNVRGZ0ceIf9NL7i2GbXhGKgJmj2ayIMXKnFyDWj+pBg3dE/RqZi/TPN0sYnSbNYEus5t1jx8PIlW5/4AQi+wdIjrvxo1djbW1vvpwONZARFdPo8YGFjUamEeroxFlPUUqI4psFh5XVATMTvqD1sk0osiY2WWaeqfp83SysNEVi4U729rqO2fPxtC+qC4ZeBgIUTLqRHi+HTv6xkW02Agt4mnUfHqjETMaNWY20hCtkSK5asmPhLoKRIAP6WmatINGBR38W/fo7V6mdwTp5wkjq1qoL4UqsNklbxII0aELiPi0LVu6m/x+/9iIaYyjKf1xtMowlohvhGEw4OoQV4hZRYCiTKa1GIa2lbFoC6utbRlby7YTUcasakC9oQjgxbXYK7ZuNes8nvDUKDMnaaY5kcQm0gJEwKI4qgGBgiNA/TFCD9miM2MT/cHeGIsZmyZObNhe8AdX0ANAiMM4s63NHBFmkWmemDndYOY06mCjKsjvaIpLEKDV8k7an9SsG+baSCTWDILM7XgQYgo+XV3mmL6+4ExDM2Z6dH0ihr4uYQ03NVMztppRY5XHo68aM6Z2k5uabqWtIERCqaUluDP9Jd2ftgjvChK00m1QpxIQoO1CzTTv/dbo0f5VNPfIN8a7vrieEFtag5+ncw4Hub4nAADXIqB7zP80jax+hEiRz0G6uriaEDdv7puue9k5ru4BaDwQIAQ0M/b42LF1y90OBggRhOj2dwDtByEm+4CrCZGjsLU1eCylBzgAbwUQcCsCGDIPet71hMih2LYtuLupGQtwisStlODOdtMyCmX+iT2FoTIIMesb0NzePrI67DuAElvNxaZrd5JEpbeajgRG6SjgezWBmjfq6/kpF5RUBBAhDtMftm8PzaTN2Lsx3diFjkc1oNsAgfJFIJ6Rp5myIq0aO7b2A1pNppSUKNkQACFa6Betra0NmlY3LRyLTqecqPzUSpMFMVQBAiVBgDLptBum1kwpydYGdF9zY6O2oySGlOFDQYgOnEaESJmke8eSKJ1p9kw0WGwSJYHm/x3P/owCBIqEgKlpxnaTaZs8zLuRAr9No0ZVb0aCB+fogxCdYzdEcseOHY1RT81YM2aM1Zk+knLdNRqU8oun/sKcpESgXaSKJ2ygiI9SgJkdlBi4g65YaNMNfVufL7h1SmMjIj/JfQGEKBnQ4dTxO0qamnpGalXees3UG6KRWIPGjAYP0+uJNOM/Y5W7SM5Q5DG0wBGka2S6TKZ3Jr49JiWKZQZ9Yl2RSE3HxIlaryLmusIMEKJibm5ra6N8ioG6kOmp9zOtLspi9fSC1HtMvS7GjBqaw4zff0JnC+oUMx3mxBGIL2DErxHwajqRmd4di5ndpsfo8mmeLrqwpbtGr+pqbGTdOCqnXpcBIarnE1sW8TyNVVUsEA4zulAq6I/F9GrDoAul6M6VsKFVefjdK2aM7lvh3wOXSfFvjQX6/435bD2woiv3k5nJL5rS9KBGl0xRso+QputBfgEV5T8IUhqt/ounomaf12uEfb7qIN1AGGpqovtUcBa47HsHCLHsXSjegPXrzeq6OiJVHwv4wsEAv2LUilaPhy5IoJA1qoe9xK3EvcwTjUa9fvqOxTRvjL6t6LFax+OhWdmIGfN4vFHTjMRocSvm9fqiQVrV8vrMKF1FStePxq8xzVnMKka3mlaF+qIdIV9vYwjD0nyIuef3IET3+BotBQJAIA8CIER0ESAABIDAAAIgRHQFIAAEgAAIEX0ACAABIJCOACJE9AggAASAACJE9AEgAASAACJE9AEgAASAQFYEMGRGxwACQAAIYMiMPgAEgAAQwJAZfQAIAAEggCEz+gAQAAJAIBcCmENE/wACQAAIYA4RfQAIAAEggDlE9AEgAASAAOYQ0QeAABAAAphDRB8AAkAACFhAAIsqFkBCFSAABNyBwP8DwngAjy4LlKQAAAAASUVORK5CYII="]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const handleClickVariant = useSnackbarHelper();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };


    useEffect(() => {
        setCurrentImageIndex(0);
    }, []);

    const showNextImage = () => {
        if (imagesArray.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesArray.length);
        }
    };

    const showPreviousImage = () => {
        if (imagesArray.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imagesArray.length) % imagesArray.length);
        }
    };


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleClickOpenDeleteUni = () => {
        setOpenDeleteUni(true);
    };

    const handleCloseDialogDeleteUni = () => {
        setOpenDeleteUni(false);
    };


    const deleteDepartment = (num: number | undefined) => {
        try {
            axiosService(true).delete(`${backendUrl.DEPARTMENT}/${num}`);
            setAnchorEl(null);
            handleCloseDialog();
            handleClickVariant('success', {
                vertical: "top",
                horizontal: "right"
            }, "Studijski program je uspješno uklonjen!")();
        } catch
            (exception) {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
        }

    }

    useEffect(() => {
        const hasAdminRole = hasRole(Roles.ADMIN);
        if (hasAdminRole) {
            setIsAdmin(hasAdminRole);
        }
    }, [])

    useEffect(() => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }
        const getDepartments = async () => {
            const departmentsRes = await getAllDepartments(numId);
            setDepartments(departmentsRes.data);
        }
        getDepartments();
    }, [deleteDepartment])

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        const departmentId = event.currentTarget.getAttribute('data-department-id');
        const id = parseInt(departmentId, 10);
        const selectedDepartment = departments.find(department => department.id === id);

        if (selectedDepartment) {
            setSelectedDepartment(selectedDepartment);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const deleteUniversity = () => {
        try {
            axiosService(true).delete(`${backendUrl.FACULTY_URL}/${faculty?.id}`);
            navigate(paths.FACULTIES);
            handleCloseDialogDeleteUni();
            handleClickVariant('success', {
                vertical: "top",
                horizontal: "right"
            }, "Fakultet je uspješno uklonjen!")();
        }
        catch
            (exception) {
            handleClickVariant('error', {vertical: "top", horizontal: "right"}, "Došlo je do greške!")();
        }

    }

    useEffect(() => {
        if (id !== undefined) {
            numId = parseInt(id, 10);
        }
        const getFaculty = async () => {
            const facultyRes = await getUniversityById(numId);
            setFaculty(facultyRes.data);
        }
        getFaculty();
    }, [])

    useEffect(() => {
        if (open) {
            setDepartmentName(selectedDepartment?.name);
            setDepartmentIdForDelete(selectedDepartment?.id);
        }
    }, [open])


    return (
        <>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                onClose={handleCloseSnackbar}
            />
            <div style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                minHeight: "29vh",
                height: "auto",
                width: "92.5%",
                border: "0.5px solid rgba(55,79,121,0.29)",
                boxShadow: "0px 0px 0.4px 0px rgba(55,79,121,0.69)",
                marginLeft: "4.4%",
                marginTop: "3%",
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <p style={{
                        fontSize: 15,
                        color: "rgba(55,79,121,0.88)",
                        fontWeight: "bold",
                        marginLeft: "1%",
                        marginTop: "1%",
                        fontFamily: "openSans"
                    }}>Informacije o fakultetu</p>
                    {isAdmin &&
                        <div
                            style={{display: "flex", alignItems: "center", marginLeft: "79.5%", marginTop: "0.3%"}}>
                            <Link to={`/edit/general/${faculty?.id}`} style={{textDecoration: 'none'}}>
                                <EditIcon style={{color: "rgba(55,79,121,0.88)", cursor: "pointer"}}/>
                            </Link>
                        </div>
                    }
                    {isAdmin &&
                        <div
                            style={{display: "flex", alignItems: "center", marginLeft: "0.5%", marginTop: "0.6%"}}>
                            <Link to={`/images/${faculty?.id}`} style={{textDecoration: 'none'}}>
                                <PhotoCamera style={{color: "rgba(55,79,121,0.88)", cursor: "pointer"}}/>
                            </Link>
                        </div>
                    }
                    {isAdmin &&
                        <DeleteOutline style={{color: "rgba(55,79,121,0.88)", marginLeft: "0.5%", cursor: "pointer"}}
                                       onClick={handleClickOpenDeleteUni}/>
                    }
                </div>
                <Divider style={{
                    backgroundColor: "rgba(55,79,121,0.18)",
                    width: "100%",
                    height: "0.1vh"
                }}/>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <img src={university} alt=""
                         style={{height: "70%", width: "8%", marginLeft: "1%", marginTop: "1%"}}
                         onClick={() => setIsOpen(true)}/>
                    <div style={{display: "flex", flexDirection: "column", marginLeft: "3%", marginTop: "1%"}}>
                        <p style={{
                            fontSize: 21,
                            color: "rgba(55,79,121,0.88)",
                            fontWeight: "bold",
                            marginTop: "1%",
                            fontFamily: "openSans"
                        }}><a
                            href={`http://${faculty?.website}`} style={{
                            textDecoration: 'none',
                            color: "rgba(55,79,121,0.88)",
                        }}>{faculty?.name}</a></p>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", marginLeft: "50%", marginTop: "-4%"}}>
                    <div style={{display: "flex", alignItems: "center", marginTop: "-9.4%"}}>
                        <FaLocationDot
                            style={{marginLeft: "5%", marginRight: "0.5%", color: "rgba(55,79,121,0.77)"}}/>
                        <p style={{
                            fontFamily: "openSans",
                            color: "#374f79",
                            // fontWeight: "bold"
                        }}>{faculty?.address}, {faculty?.city}, {faculty?.postalCode}</p>
                    </div>
                    <div style={{display: "flex", alignItems: "center", marginTop: "-3.4%"}}>
                        <FaPhone style={{marginLeft: "5%", marginRight: "0.9%", color: "rgba(55,79,121,0.77)"}}/>
                        <p style={{
                            fontFamily: "openSans",
                            color: "#374f79",
                            // fontWeight: "bold"
                        }}>{faculty?.phoneNumber}</p>
                    </div>
                    <div style={{display: "flex", alignItems: "center", marginTop: "-3.4%"}}>
                        <MdEmail style={{marginLeft: "5%", marginRight: "0.8%", color: "rgba(55,79,121,0.77)"}}/>
                        <p style={{fontFamily: "openSans", color: "#3992a8"}}>
                            <a href={`mailto:${faculty?.email}`}
                               style={{
                                   fontFamily: "openSans",
                                   color: "#374f79",
                                   textDecoration: 'none'
                               }}>{faculty?.email}</a></p>
                    </div>
                </div>
            </div>
            <div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: "1%"
                }}>
                    <p style={{
                        fontSize: 17,
                        color: "rgba(55,79,121,0.88)",
                        fontWeight: "bold",
                        marginLeft: "4.4%",
                        fontFamily: "openSans"
                    }}>Studijski programi</p>
                    {isAdmin &&
                        <ControlPointIcon onClick={() => setOpenAddDepartmentPopup(true)}
                                          style={{
                                              color: "rgba(55,79,121,0.88)",
                                              marginLeft: "0.5%",
                                              width: "20px",
                                              height: "20px",
                                              cursor: "pointer"
                                          }}/>
                    }
                </div>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "2.55%",
                    justifyContent: "flex-start",
                    paddingTop: "1%",
                    marginLeft: "4.4%",
                }}>
                    {departments.map((department: any) => {
                        return (
                            <div style={{
                                width: "30.5%",
                                height: "auto",
                                minHeight: "210px",
                                marginBottom: "2.5%",
                                backgroundColor: "#ffffff",
                                border: "0.5px solid rgba(55,79,121,0.29)",
                                boxShadow: "0px 0px 0.4px 0px rgba(55,79,121,0.69)",

                            }}
                            >
                                <div style={{
                                    display: 'flex',
                                    width: '100%',
                                    alignItems: 'center',
                                    marginTop: "4%",
                                    justifyContent: 'space-between',
                                    marginLeft: "5%",
                                    paddingRight: "10%"
                                }}>
                                    <div style={{
                                        flexGrow: 1,
                                        marginRight: '20px',
                                    }}>
                                        <p style={{
                                            fontSize: 15,
                                            color: "rgba(55,79,121,0.82)",
                                            fontWeight: "bolder",
                                            textTransform: "uppercase",
                                            fontFamily: "openSans",
                                            margin: 0,
                                        }}>
                                            {department.name}
                                        </p>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: "35px",
                                        width: "35px",
                                        backgroundColor: "rgba(184,212,236,0.67)"
                                    }}>
                                        <AppsIcon data-department-id={department?.id}
                                                  style={{color: "rgba(55,79,121,0.71)"}} onClick={handleClick}/>
                                    </div>
                                    {isAdmin &&
                                        <UpdateDepartmentDialog openUpdateDepartmentPopup={openUpdateDepartmentPopup}
                                                                setOpenUpdateDepartmentPopup={setOpenUpdateDepartmentPopup}
                                                                university={faculty}
                                                                department={selectedDepartment}
                                        />
                                    }
                                    {isAdmin &&
                                        <StyledMenu
                                            id="demo-customized-menu"
                                            MenuListProps={{
                                                'aria-labelledby': 'demo-customized-button',
                                            }}
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem
                                                onClick={() => {
                                                    handleClose();
                                                    setOpenUpdateDepartmentPopup(true);
                                                }}
                                            ><UpdateOutlined/>Update</MenuItem>
                                            <MenuItem onClick={() => {
                                                handleClose();
                                                handleClickOpen();
                                            }}><DeleteOutline/>Delete</MenuItem>
                                        </StyledMenu>
                                    }
                                </div>
                                <div>
                                    <p style={{
                                        fontSize: 16,
                                        color: "rgba(55,79,121,0.82)",
                                        // fontWeight: "bold",
                                        marginTop: "3%",
                                        marginLeft: "5%",
                                        fontFamily: "openSans"
                                    }}>Na ovom studijskom programu postoje sljedeći smjerovi:</p>
                                    <p style={{
                                        fontSize: 15,
                                        color: "rgba(55,79,121,0.82)",
                                        fontWeight: "bold",
                                        marginLeft: "10%",
                                        fontFamily: "openSans"
                                    }}><Stop
                                        style={{color: "rgba(55,79,121,0.82)", height: "18px", width: "18px"}}/>Opsti
                                    </p>
                                    <p style={{
                                        fontSize: 15,
                                        color: "rgba(55,79,121,0.82)",
                                        fontWeight: "bold",
                                        marginLeft: "10%",
                                        fontFamily: "openSans"
                                    }}><Stop
                                        style={{color: "rgba(55,79,121,0.82)", height: "18px", width: "18px"}}/>Opsti
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <CreateDepartmentDialog openAddDepartmentPopup={openAddDepartmentPopup}
                                    setOpenAddDepartmentPopup={setOpenAddDepartmentPopup}
                                    university={faculty}
            />
            <AlertDialog open={open} setOpen={setOpen} handleClickOpen={handleClickOpen} handleClose={handleCloseDialog}
                         handleSave={() => deleteDepartment(departmentIdForDelete)}
                         dialogContent={"Da li ste sigurni da želite trajno obrisati studijski program " + departmentName + "?"}
                         dialogTitle={"Brisanje studijskog programa"}/>
            <AlertDialog open={openDeleteUni} setOpen={setOpenDeleteUni} handleClickOpen={handleClickOpenDeleteUni}
                         handleClose={handleCloseDialogDeleteUni}
                         handleSave={deleteUniversity}
                         dialogContent={"Da li ste sigurni da želite trajno obrisati " + faculty?.name + "?"}
                         dialogTitle={"Brisanje fakulteta"}/>
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
                />
            )}

        </>
    );
}

export default FacultyDetails;