package quiz

import (
	"reflect"
	"testing"
	"time"
)

func TestOneStreak(t *testing.T) {
	testDates := []time.Time{time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local)}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 1,
		Freeze: 0,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func TestThreeInSameDayStreak(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 2, 13, 0, 0, 0, time.Local),
		time.Date(2022, 2, 2, 14, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 1,
		Freeze: 0,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func TestTwoStreak(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 3, 12, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 2,
		Freeze: 0,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func TestTwoStreakOverLongBreak(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 1, 0, 0, 0, time.Local),
		time.Date(2022, 2, 3, 19, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 2,
		Freeze: 0,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func Test5Streak(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 3, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 4, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 5, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 6, 12, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 5,
		Freeze: 1,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func Test10Streak(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 3, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 4, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 5, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 6, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 7, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 8, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 9, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 10, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 11, 12, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 10,
		Freeze: 2,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func Test10StreakWithOneGapAfterFreeze(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 3, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 4, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 5, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 6, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 8, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 9, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 10, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 11, 12, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 9,
		Freeze: 0,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func TestRevivingLostStreat(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local),

		time.Date(2022, 2, 11, 12, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 1,
		Freeze: 0,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func TestLotsWithManyGaps(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 2, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 3, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 4, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 5, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 6, 12, 0, 0, 0, time.Local),

		time.Date(2022, 2, 8, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 9, 12, 0, 0, 0, time.Local),

		time.Date(2022, 2, 11, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 12, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 13, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 14, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 15, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 16, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 17, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 18, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 19, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 20, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 21, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 22, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 23, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 24, 12, 0, 0, 0, time.Local),

		time.Date(2022, 2, 26, 12, 0, 0, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 15,
		Freeze: 1,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}

func TestBigGap(t *testing.T) {
	testDates := []time.Time{
		time.Date(2022, 2, 10, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 11, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 12, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 13, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 14, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 15, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 16, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 17, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 18, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 19, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 20, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 21, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 22, 12, 0, 0, 0, time.Local),
		time.Date(2022, 2, 23, 12, 0, 0, 0, time.Local),

		time.Date(2022, 2, 28, 22, 10, 10, 0, time.Local),
		time.Date(2022, 2, 28, 22, 11, 10, 0, time.Local),
	}

	result := getStreakStatusInternal(testDates)

	expected := streakResponse{
		Streak: 1,
		Freeze: 0,
	}

	if !reflect.DeepEqual(result, expected) {
		t.Errorf("unexpected response: got %+v, want %+v", result, expected)
	}
}
