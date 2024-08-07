# Table

[TOC]

## Define

A table is a matrix composed of cells and allows a portion of the cell grid matrix to aggregate into a larger region.

<img src="assets/Table.svg" alt="Table" style="zoom:25%;" />

## View

<img src="assets/Table2.svg" alt="Table2" style="zoom:25%;" />

## Operation

### Add a row/column & Delete a row/column

If the inserted row or column passes through a merged region in the table (i.e., the middle part of the region, except for the border rows or columns), the size of the row or column in that region increases by one.

If a row or column that needs to be deleted crosses a merged region in the table, the size of that region's rows or columns decreases by one.

### Merge cells & Split a cell

### 

