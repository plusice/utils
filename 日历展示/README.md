#####使用:

    // jquery/zepto required,return jquery/zepto element
    calendarViewBuilder.buildDateToDate({
        sDate: new Date(),
        eDate: new Date(new Date().getTime() + 2592000000),
        // renderDay is not necessary
        renderDay: function($td, curDate) {
            return $td.append(curDate.getDate() + 'test');
        }
    });

