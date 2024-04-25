import {SnackbarOrigin, useSnackbar, VariantType} from "notistack";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(theme => ({
  snackbarMessage: {
    whiteSpace: 'pre-wrap',
  },
  // outlinedSuccess: {
  //   backgroundColor: '#5ea46a',
  //   color: '#white',
  //   // border: '1.5px solid #5d9b68',
  // },
  // outlinedError: {
  //   backgroundColor: '#f6f5f5',
  //   color: '#be0909',
  //   border: '2px solid #be0909',
  // },
  // Definirajte ostale varijante po potrebi...
}));

export function useSnackbarHelper() {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();



  const handleClickVariant = (variant: VariantType, anchorOrigin: SnackbarOrigin, message: string) => () => {
    const variantClass = `outlined${variant.charAt(0).toUpperCase() + variant.slice(1)}` as keyof typeof classes;
    enqueueSnackbar(message, {
      variant,
      className: classes[variantClass],
      anchorOrigin,
    });
  };

  return handleClickVariant;
}