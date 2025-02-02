import { useEffect } from "react";
import styled from "styled-components";
import { Formik, Form, Field } from "formik";
import { NextRouter } from "next/router";
import RandomIcon from "public/icons/random.svg";
import { FiltersType } from "lib/filters";

import { cssQueries } from "styles/utils";

import { Button } from "components/basics/Button";
import { ThemeSelect } from "components/common/ThemeSelect";
import { PlatformSelect } from "components/common/PlatformSelect";
import { SearchBar } from "components/common/SearchBar";

const StyledForm = styled(Form)<{ open: boolean }>`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, 1fr);

  @media ${cssQueries.mobile} {
    display: ${({ open }) => (open ? "flex" : "none")};
    flex-direction: column;
    padding-top: 1rem;
  }
`;

const StyledLabel = styled.span`
  line-height: 2;
`;

const RandomButtonContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: end;

  @media ${cssQueries.mobile} {
    justify-content: space-between;
    padding-top: 1rem;
  }
`;

const ApplyButton = styled(Button)`
  @media ${cssQueries.desktop} {
    display: none;
  }
`;

type FiltersForm = {
  closeForm: () => void;
  filters: FiltersType;
  initialValues: FiltersType;
  onSubmit: (values: FiltersType) => void;
  router: NextRouter;
  toggleOn: boolean;
};

export const FiltersForm = ({
  closeForm,
  filters,
  initialValues,
  onSubmit,
  router,
  toggleOn,
}: FiltersForm) => {
  return (
    <Formik initialValues={{}} onSubmit={onSubmit}>
      {({ values, setFieldValue, submitForm, ...formikBag }) => {
        // Router refresh in 2 times, make sure we refresh once the router.isReady
        useEffect(() => {
          formikBag.setValues(initialValues);
        }, [filters]);

        const onChange = (fieldName: string) => (options: string[]) => {
          setFieldValue(fieldName, options);
          submitForm();
        };
        return (
          <StyledForm open={toggleOn}>
            <Field name="themes">
              {({ field }) => (
                <label htmlFor="theme">
                  <StyledLabel>Filtrer par thème :</StyledLabel>
                  <ThemeSelect
                    {...field}
                    setFieldValue={setFieldValue}
                    onChange={onChange(field.name)}
                  />
                </label>
              )}
            </Field>

            <Field name="platforms">
              {({ field }) => (
                <label htmlFor="platforms">
                  <StyledLabel>Filtrer par plateforme :</StyledLabel>
                  <PlatformSelect {...field} onChange={onChange(field.name)} />
                </label>
              )}
            </Field>

            <Field name="searchTerms">
              {({ field }) => (
                <label htmlFor="searchTerms" style={{ position: "relative" }}>
                  <StyledLabel>Filtrer par nom :</StyledLabel>
                  <SearchBar
                    {...field}
                    filters={filters}
                    setFieldValue={setFieldValue}
                    submitForm={submitForm}
                  />
                </label>
              )}
            </Field>

            <RandomButtonContainer>
              <ApplyButton
                onClick={() => {
                  submitForm();
                  closeForm();
                }}
              >
                Appliquer
              </ApplyButton>
              <Button
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => {
                  router.push("/search");
                  closeForm();
                }}
              >
                <RandomIcon role="presentation" aria-hidden="true" />
                &nbsp; Au hasard
              </Button>
            </RandomButtonContainer>
          </StyledForm>
        );
      }}
    </Formik>
  );
};
