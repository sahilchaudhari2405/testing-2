import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const AdvancePayPopup = ({ open, onClose, advancePay }) => {
    console.log(advancePay)
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Advance Payments</DialogTitle>
            <DialogContent>
                {advancePay && advancePay.length > 0 ? (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {advancePay.map((entry) => (
                                    <TableRow key={entry._id}>
                                        <TableCell>{entry.date}</TableCell>
                                        <TableCell>{entry.time}</TableCell>
                                        <TableCell>{entry.amount}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <p>No advance payments recorded.</p>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdvancePayPopup;
