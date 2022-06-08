import JobListing from "../components/JobListing";
import FilterSidebar from "../components/Filter/FilterSidebar";
import SearchButton from "../components/Home/SearchButton";
import Loading from "../components/Loading";

import { fetchJobs } from "../store/jobs/jobsSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompany } from "../store/tempStorage/tempStorageSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import en from "../locales/en";
import ar from "../locales/ar";

function JobFinder() {
  const jobs = useSelector((state) => state.jobs.jobs);
  const companies = useSelector((state) => state.tempStorage.company);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [isSearchEmpty, setIsSearchEmpty] = useState(true);
  const dispatch = useDispatch();
  const Router = useRouter();
  const { locale } = Router;
  const t = locale === "ar" ? ar : en;

  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchCompany());
  }, [dispatch]);

  const handleSearchSubmit = (searchValue) => {
    if (searchValue === "") {
      setIsSearchEmpty(true);
    }

    const filterResult = jobs.filter((job) =>
      job.position.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredJobs(filterResult);
    setIsSearchEmpty(false);
  };

  if (!jobs || !companies) return <Loading />;

  return (
    <div>
      <div className="bg-light">
        <div className="px-4 lg:px-48 w-full py-20 ">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-primary text-4xl mb-1">{t.jobs.JobsFider}</h1>
            <h2 className="text-secondary">{t.jobs.JobsFinerDesc}</h2>
            <div className="mt-5">
              <SearchButton onSearchSubmit={handleSearchSubmit} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3">
        <div className="bg-lightgrey px-5 lg:pl-48 w-full py-10 pr-8">
          <FilterSidebar
            filter={t.jobs.Filter}
            salaryRange={t.jobs.SalaryRanges}
            from={t.jobs.From}
            to={t.jobs.To}
            location={t.jobs.Location}
            TypeOfEmployment={t.jobs.TypeOfEmployment}
            cetegory={t.jobs.Category}
            Experience={t.jobs.Experience}
            WrokLevel={t.jobs.WrokLevel}
            ChooseAllThatApplies={t.jobs.ChooseAllThatApplies}
          />
        </div>
        <div className="bg-body col-span-2">
          <div className="pl-8 lg:pr-48 w-full py-10 ">
            {" "}
            <div className="flex justify-between mb-5">
              <p>
                {t.jobs.Total}{" "}
                {isSearchEmpty ? jobs.length : filteredJobs.length}{" "}
                {t.jobs.Results}
              </p>
              <p>{t.jobs.SortBy}</p>
            </div>
            {isSearchEmpty
              ? jobs.map((jobsData, index) => {
                  const company = companies.filter(
                    (item) => item.id === jobsData.company_id
                  );

                  return (
                    <div key={index}>
                      <JobListing job={jobsData} company={company[0]} />
                    </div>
                  );
                })
              : filteredJobs.map((jobsData, index) => {
                  const company = companies.filter(
                    (item) => item.id === jobsData.company_id
                  );

                  return (
                    <div key={index}>
                      <JobListing job={jobsData} company={company[0]} />
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobFinder;