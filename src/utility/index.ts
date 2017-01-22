export class Utility {

    public static get currentRankedYear(): number {
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 11);
        const year = currentDate.getFullYear();

        return year + 1;
    }
}
