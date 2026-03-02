# ML Platform - Quick Start Guide (First Time Users)

## ⚡ 30-Second Setup

1. **Open Command Prompt** in the project folder
2. **Type**: `setup.bat` and press Enter
3. **Wait** for it to finish (2-5 minutes depending on internet speed)
4. **Done!** Dependencies are installed

## 🚀 Start the Application

1. **Type**: `run.bat` and press Enter
2. **Wait** for the browser to open (say "yes" if Windows asks for permission)
3. **You're done!** The app is running

## 📊 Your First ML Model (2 minutes)

### Step 1: Upload CSV (30 seconds)
```
1. Click "Browse" or drag the file into the box
2. Use the included "sample_data.csv" file
3. Click "Upload Dataset"
4. Wait for analysis to complete
```

### Step 2: Select Target Column (10 seconds)
```
1. Dropdown shows: SepalLength, SepalWidth, PetalLength, PetalWidth, Species
2. Select "Species" (this is what we want to predict)
3. It automatically shows "Classification" because Species has categories
```

### Step 3: Pick Your Models (10 seconds)
```
1. All recommended models are already checked
2. You can uncheck any you don't want
3. Or click "Select all" to use all 4
```

### Step 4: Train (30 seconds)
```
1. Click "Train & Compare"
2. Watch the spinner
3. Results appear when done!
```

### Step 5: Explore (10 seconds)
```
Tabs at the top:
- Dataset: Shows your data
- Correlation: Shows relationships between columns
- Matrices: Shows detailed metrics for each model
- Comparison: Shows all models side-by-side - THIS IS THE BEST TAB!
```

## 📈 What to Look For

### In the Comparison Tab
- **Best Algorithm**: Shows which model performs best (usually Random Forest or XGBoost)
- **Bar Chart**: Higher bars = better performance
- **Leaderboard**: Tells you the exact rankings

### What the Metrics Mean
- **Accuracy**: Out of 100 predictions, how many are correct
- **Precision**: When the model says "Setosa", how often is it right
- **Recall**: Of all the actual Setosas, how many did it find
- **F1 Score**: Balance between precision and recall

## 💡 Pro Tips

1. **Try Different Data**: Upload your own CSV file
   - Any CSV works! (,  ;  tab  pipe delimiters)
   - Supports European decimal format (1,5 instead of 1.5)

2. **Classification vs Regression**
   - **Classification**: Predicting categories (yes/no, A/B/C, disease/healthy)
   - **Regression**: Predicting numbers (price, temperature, quantity)
   - App auto-detects which one!

3. **Algorithm Tips**
   - **Random Forest**: Usually most accurate
   - **Logistic Regression**: Fastest, interpretable
   - **Decision Tree**: East to understand
   - **KNN**: Good for small datasets

4. **Download Your Model**
   - After training, click "Download .pkl" to save the best model
   - Can use it later for predictions

## 🔍 Troubleshooting (Quick Fixes)

### "Can't connect to server"
```
1. Open Command Prompt
2. Check if another cmd window has the backend running
3. If not, manually start both:
   - Terminal 1: cd backend && python -m uvicorn main:app --reload
   - Terminal 2: cd app && npm run dev
```

### "Port already in use"
```
The app tried to use port 5173 but it's busy. 
Look at the Terminal 2 output for the new port number.
Usually it will be 5174 or 5175.
```

### "Module not found" error
```
Run again: setup.bat
If still broken, try: pip install -r backend/requirements.txt
```

### "Upload failed"
```
Check:
1. File is actually a .csv file (not .xlsx, .txt, etc.)
2. File is not corrupted
3. You have at least 10 rows of data
```

## 📚 Learn More

- **Full README**: Open `README.md` for complete documentation
- **What was fixed**: Open `FIXES.md` for technical details
- **Validation**: Run `python test_integration.py` to test everything

## 🎯 Example Datasets to Try

### Classification Examples
1. **Iris Flower** (included as sample_data.csv)
   - Predict: Species (3 classes)
   - Features: Sepal/Petal measurements

2. **Titanic Passenger**
   - Predict: Survived (Yes/No)
   - Features: Age, Gender, Class, Fare

3. **Breast Cancer**
   - Predict: Malignant/Benign
   - Features: Tumor measurements

### Regression Examples
1. **House Prices**
   - Predict: Price
   - Features: Area, Bedrooms, Location

2. **Weather Temperature**
   - Predict: Temperature
   - Features: Humidity, Air Pressure, Cloud Cover

## ❓ FAQ

**Q: Is my data safe?**
A: Yes! Data is only processed locally on your computer. Nothing is sent anywhere.

**Q: Can I use very large files?**
A: Yes! The app can handle files with 100k+ rows, but it might be slower.

**Q: Can I predict with the downloaded model?**
A: Yes, but you'll need to write Python code. See README for examples.

**Q: How accurate will the predictions be?**
A: Depends on your data quality. More data = better accuracy (usually).

**Q: Which algorithm should I trust most?**
A: The one marked "🥇 BEST" at the top! That's the highest F1 score.

**Q: What if no algorithms work?**
A: Your data might be too small (<10 rows) or have issues. Check the error message.

## 🎓 What You're Learning

By using this app, you learn:
✓ How different ML algorithms compare
✓ Why some models perform better than others
✓ What features impact predictions
✓ How to evaluate model performance
✓ Full-stack ML development

## 🚀 Next Steps

1. ✅ Run the app (you already did!)
2. ✅ Test with sample data (Iris is included)
3. ✅ Try your own CSV file
4. ✅ Read the full README for more features
5. ✅ Try with regression data (numbers to predict)

---

**You're now ready to explore machine learning!**

If you get stuck, check the troubleshooting section above.
