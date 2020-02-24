# -*- coding: utf-8 -*-
"""
Created on Fri Feb 21 12:38:25 2020

@author: jghuynh
"""

import pandas as pd

myCollegeDF = pd.read_csv("C:\\Users\\jghuynh\\Documents\\Data_Visualization_360\\mrc_table2.csv")

#%%

CAcolleges = myCollegeDF[myCollegeDF.state == "CA"]

CAselectedCols = CAcolleges.loc[:, ["name", "type", "tier", "tier_name", "count", "k_median", "par_median", "female"]].dropna()
CAselectedCols.to_csv("CAselectedCols.csv", encoding='utf-8', index=False)
