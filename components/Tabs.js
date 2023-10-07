import Select from "@components/form/Select";
import { classNames } from "@services/utils/classNames";

export default function Tabs({ tabs, setTabs, selectedTab }) {
  return (
    <div>
      <div className="sm:hidden">
        {tabs.length > 1 && (
          <Select
            name="tabs"
            value={tabs.find((tab) => tab === selectedTab.name)}
            label="Select a tab"
            onChange={(e) => setTabs(e, e.target.value)}
            className="block w-full rounded-md border-primary-medium-low dark:bg-primary-medium focus:border-secondary-medium focus:ring-secondary-medium"
            options={tabs.map((tab) => ({ label: tab.name, value: tab.name }))}
          />
        )}
      </div>
      <div className="hidden sm:block mb-4">
        <div className="border-b border-primary-medium-low">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                type="button"
                aria-label={tab.name}
                key={tab.name}
                onClick={() => setTabs(tab)}
                className={classNames(
                  tab.current
                    ? "border-tertiary-medium "
                    : "border-transparent text-primary-medium dark:text-primary-low dark:hover:text-tertiary-medium  hover:text-tertiary-medium hover:border-tertiary-medium",
                  `justify-center text-base group flex border-b-2 py-4 font-medium grow`,
                )}
                aria-current={selectedTab ? "page" : undefined}
              >
                {tab.icon && (
                  <tab.icon
                    className="-ml-0.5 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                )}
                {tab.name} {tab.total ? `(${tab.total})` : ""}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
