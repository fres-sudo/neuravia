# Scoring System

This directory contains the scoring system for tracking patient progress through various activities.

## Overview

The scoring system tracks patient progress through four types of activities:
- `initial_assessment`: Initial patient assessment (weight: 1.0)
- `mri_upload`: MRI analysis results (weight: 0.8)
- `weekly_form`: Weekly diary responses (weight: 0.6)
- `game_played`: Game performance scores (weight: 0.4)

## Components

### 1. BoostScoreService (`service.ts`)
Core service that handles score calculations and provides utility methods.

**Key Methods:**
- `calculateInitialAssessment()`: Returns 100 for initial assessment
- `calculateMriUpload()`: Converts probability arrays to weighted scores
- `calculateWeeklyForm()`: Converts 1-5 scale responses to 0-100 scores
- `calculateGamePlayed()`: Pass-through for game scores
- `calculateNewScore()`: Applies boost algorithm to calculate new score
- `getDefaultWeight()`: Returns default weight for activity type
- `prepareScoreData()`: Prepares data for database insertion

### 2. Scoring Router (`../server/api/routers/scoring.router.ts`)
tRPC router for database operations on boost scores.

**Endpoints:**
- `insert`: Insert a new boost score
- `fetchByPatient`: Get recent scores for a patient
- `getLatestScore`: Get the most recent score for a patient
- `getScoreHistory`: Get score history with optional activity type filter

### 3. Utility Functions (`../lib/scoring-utils.ts`)
Helper functions for easy integration throughout the application.

## Usage Examples

### 1. Creating a Patient with Initial Score
```typescript
// In add-patient-dialog.tsx
const activityValue = await boostService.calculateInitialAssessment(initialInfo);
const scoreData = boostService.prepareScoreData({
  patientId: createdPatient.id,
  activityType: 'initial_assessment',
  activityValue: activityValue,
  previousScore: 0,
  metadata: { assessmentData: initialInfo },
});

await insertScoreMutation.mutateAsync(scoreData);
```

### 2. Weekly Form Submission
```typescript
// Automatically handled in diary.router.ts when creating diary entries
const responses = [memory, orientation, communication, dailyActivities, moodBehavior, sleep, social];
const activityValue = await boostService.calculateWeeklyForm(responses);
```

### 3. MRI Upload
```typescript
// Example usage in MRI upload handler
const probabilities = [0.1, 0.3, 0.4, 0.2]; // [healthy, mild, moderate, severe]
const activityValue = await boostService.calculateMriUpload({ probabilities });

const scoreData = boostService.prepareScoreData({
  patientId: patientId,
  activityType: 'mri_upload',
  activityValue: activityValue,
  previousScore: latestScore,
  metadata: { mriResults: results },
});

await insertScoreMutation.mutateAsync(scoreData);
```

### 4. Game Completion
```typescript
// Example usage in game completion handler
const activityValue = await boostService.calculateGamePlayed(gameScore);

const scoreData = boostService.prepareScoreData({
  patientId: patientId,
  activityType: 'game_played',
  activityValue: activityValue,
  previousScore: latestScore,
  metadata: { gameType: 'memory_game', level: 3 },
});

await insertScoreMutation.mutateAsync(scoreData);
```

## Score Calculation Algorithm

The boost algorithm calculates new scores as:
```
newScore = previousScore + (activityValue - previousScore) * weight
```

This ensures that:
- Scores always move toward the activity value
- Higher weights cause faster convergence
- Scores stay within 0-100 range

## Database Schema

The `boostScores` table stores:
- `id`: Unique identifier
- `patientId`: Reference to patient
- `activityType`: Type of activity performed
- `previousScore`: Score before activity
- `newScore`: Score after activity
- `activityValue`: Raw score from activity
- `weight`: Weight applied to the boost
- `metadata`: Additional activity-specific data
- `timestamp`: When the score was recorded

## Integration Points

1. **Patient Creation**: Initial assessment score is automatically inserted
2. **Weekly Forms**: Scores are automatically calculated and inserted when diaries are created
3. **MRI Uploads**: Should call scoring router after successful analysis
4. **Game Completion**: Should call scoring router after game completion

## Future Enhancements

- Custom weight configuration per patient
- Score trend analysis and visualization
- Activity-specific scoring algorithms
- Performance metrics and analytics
