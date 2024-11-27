import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const GreyBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0), // Top and bottom spacing
  borderRadius: '8px',
}));

export default function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false);
  const [oneTimePayment, setOneTimePayment] = React.useState({});
  const [paymentQueue, setPaymentQueue] = React.useState([]);

  // Simulated fetch functions
  const fetchOneTimePayment = () => ({
    date: '11/23/2024',
    amount: '$75.00',
  });

  const fetchPaymentQueue = () => [
    {
      date: '11/24/2024', // Dynamic date
      chipLabel: 'FAILED PAYMENT RERUN',
      chipColor: 'warning',
      amount: '$110.34',
    },
    {
      date: '11/23/2024',
      chipLabel: 'AUTOMATIC',
      chipColor: 'success',
      amount: '$45.50',
    },
  ];

  const handleClickOpen = () => {
    // Fetch both pieces of data simultaneously
    const fetchedOneTimePayment = fetchOneTimePayment();
    const fetchedPaymentQueue = fetchPaymentQueue();

    setOneTimePayment(fetchedOneTimePayment);
    setPaymentQueue(fetchedPaymentQueue);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Schedule Payments
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Are you sure?
        </DialogTitle>
        <DialogContent>
          <Typography>
            You are attempting to schedule a payment within the same time frame
            as existing payments. Proceeding may result in a duplicate charge.
          </Typography>

          {/* This Payment Section */}
          <GreyBox>
            <Typography fontWeight="bold">This Payment:</Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              {/* Date */}
              <Typography variant="body2" sx={{ fontWeight: 'light' }}>
                {oneTimePayment.date || 'Loading...'}
              </Typography>

              {/* Chip */}
              <Chip label="ONE TIME PAYMENT" color="info" />

              {/* Payment Amount */}
              <Typography variant="body2" sx={{ marginLeft: 2 }}>
                {oneTimePayment.amount || 'Loading...'}
              </Typography>
            </Box>
          </GreyBox>
          {/* Pending Upcoming Payments Section */}
          <GreyBox>
            <Typography fontWeight="bold">
              Pending Upcoming Payments:
            </Typography>
            {paymentQueue.map((payment, index) => (
              <React.Fragment key={index}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  {/* Date */}
                  <Typography variant="body2" sx={{ fontWeight: 'light' }}>
                    {payment.date}
                  </Typography>

                  {/* Chip */}
                  <Chip label={payment.chipLabel} color={payment.chipColor} />

                  {/* Payment Amount */}
                  <Typography variant="body2" sx={{ marginLeft: 2 }}>
                    {payment.amount}
                  </Typography>
                </Box>

                {/* Divider */}
                {index < paymentQueue.length - 1 && <Divider sx={{ my: 2 }} />}
              </React.Fragment>
            ))}
            <Box my={2} /> {/* Adjust `my` for more or less space */}
            <Typography
              variant="body2"
              color="textSecondary"
              style={{ fontStyle: 'italic' }}
              align="right"
            >
              *Scheduled transactions are not guaranteed to be successful
            </Typography>
          </GreyBox>
        </DialogContent>
        <Divider component="" />
        <DialogContent>
          <Typography>
            Do you wish to proceed with the following changes?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Nevermind
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Yes, Schedule Payment
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}